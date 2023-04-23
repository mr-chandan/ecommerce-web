import { mongooseConnection } from "@/lib/mongos";
import { Product } from "@/models/Products";

export default async function products(req, res) {
    const { method } = req;
    await mongooseConnection();

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Product.findOne({ _id: req.query.id }));
        } else {
            res.json(await Product.find());
        }
    }

    if (method == 'POST') {
        const { title, description, price, images, category,properties} = req.body;
        const productDoc = await Product.create({
            title, description, price, images, category,properties
        })
        res.json(productDoc)
    }

    if (method == 'PUT') {
        const { title, description, price, _id, images, category,properties } = req.body
        await Product.updateOne({ _id }, { title, description, price, images, category,properties })
        res.json(true)
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            await Product.deleteOne({ _id: req.query?.id });
            res.json(true);
        }
    }
}