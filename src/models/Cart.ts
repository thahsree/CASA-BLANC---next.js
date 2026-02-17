import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICartItem {
    productId: string;
    variantId: string;
    quantity: number;
    title: string;
    price: number;
    image?: string;
    _id?: mongoose.Types.ObjectId;
}

export interface ICart extends Document {
    items: ICartItem[];
    subtotal: number;
    createdAt: Date;
    updatedAt: Date;
}

const cartSchema = new Schema<ICart>(
    {
        items: [
            {
                productId: { type: String, required: true },
                variantId: { type: String, required: true },
                quantity: { type: Number, required: true, min: 1 },
                title: { type: String, required: true },
                price: { type: Number, required: true },
                image: { type: String },
            },
        ],
        subtotal: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Calculate subtotal before saving
cartSchema.pre("save", function () {
    this.subtotal = this.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
});

const Cart: Model<ICart> =
    mongoose.models.Cart || mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
