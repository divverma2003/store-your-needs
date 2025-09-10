import { stripe } from "../lib/stripe.js";
import { createNewCoupon } from "../lib/utils.js";
import getTransporter from "../lib/nodemailer.js";

export const createCheckoutSession = async (req, res) => {
  const BASE_URL =
    process.env.CLIENT_URL || "http://localhost:5000/api/payments";
  try {
    // get products from cart
    const { products, couponCode } = req.body;

    console.log("Products received for checkout:", products);

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }
    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); // convert to cents
      totalAmount += amount * product.quantity;

      // send to stripe
      // for each product, return it's total price, name, and image
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });
    let coupon = null;

    if (couponCode) {
      coupon = await coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        // apply coupon discount
        totalAmount -= Math.round((totalAmount * coupon.discount) / 100);
      }
    }

    // now that the final price has been calculated, create a session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${BASE_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });

    // create a coupon for the user for their next purchase if they spend
    // over $150
    if (totalAmount >= 15000) {
      await createNewCoupon(req.user._id);
    }

    console.log("Stripe checkout session created:", session.id);
    return res.status(200).json({
      message: "Checkout session created successfully",
      id: session.id,
      totalAmount: totalAmount / 100,
    });
  } catch (error) {
    console.error("Error in createCheckoutSession paymentController:", error);
    res.status(500).json({
      message: error.message || `Error processing checkout session.`,
      error: error.message,
    });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // check if payment was successfully completed

    // Handle successful checkout
    if (session.payment_status === "paid") {
      // TODO: Fulfill the order, e.g., update database, send confirmation email + deactivate coupon, etc.
      // if the coupon was used, deactivate it
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          }, // the query
          { isActive: false } // the action
        );
      }
      // create a new order
      // convert metadata from string to JSON
      const products = JSON.parse(session.metadata.products);
      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100, // convert to dollars
        stripeSessionId: sessionId,
      });
      await newOrder.save();
      // let's get the user email, name, and order details
      const user = await User.findById(session.metadata.userId);
      const email = user.email;
      const name = user.name;
      const orderDetails = {
        id: newOrder._id,
        products,
        totalAmount: newOrder.totalAmount,
      };

      // send confirmation email
      const mailOptions = preparePurchaseSuccessEmail(
        email,
        name,
        orderDetails
      );

      let message = "Payment sucessful and order created.";
      try {
        const transporter = getTransporter();
        await transporter.sendMail(mailOptions);
        console.log("Purchase confirmation email sent to:", email);
        message += " and email sent successfully.";
      } catch (error) {
        console.error("Error sending email:", error);
        message += " but email failed to send.";
      }

      return res.status(200).json({
        success: true,
        message: message,
        data: { orderId: newOrder._id },
      });
    }
  } catch (error) {
    console.error("Error in checkoutSuccess paymentController:", error);
    res.status(500).json({
      message: error.message || `Error processing successful checkout.`,
      error: error.message,
    });
  }
};
