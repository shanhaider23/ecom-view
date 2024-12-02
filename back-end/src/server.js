import { MongoClient } from 'mongodb'
import express from 'express';
import path from 'path';
async function start() {
	const username = encodeURIComponent("shanhaider");
	const password = encodeURIComponent("Alizejan@572");
	const cluster = "cluster0.v6siq.mongodb.net";
	const authSource = "admin"; // Change if your auth source is different
	const authMechanism = "SCRAM-SHA-1"; // Use the correct mechanism, default is often SCRAM-SHA-1

	const uri = `mongodb+srv://${username}:${password}@${cluster}/?authSource=${authSource}&authMechanism=${authMechanism}`;

	const client = new MongoClient(uri);
	try {
		await client.connect();
		console.log("Connected to MongoDB!");
		const db = client.db('fsv-db');
		const app = express();
		app.use(express.json())

		app.use('/images', express.static(path.join(__dirname, '../assets')));


		app.get('/api/products', async (req, res) => {
			const products = await db.collection('products').find({}).toArray();
			res.send(products);
		});

		async function populateCartIds(ids) {
			return Promise.all(
				ids.map((id) => db.collection('products').findOne({ id }))
			);
		}

		app.get('/api/users/:userId/cart', async (req, res) => {
			const user = await db
				.collection('users')
				.findOne({ id: req.params.userId });
			const populatedCart = await populateCartIds(user?.cartItems || []);
			res.json(populatedCart);
		});

		app.get('/api/products/:productId', async (req, res) => {
			const productId = req.params.productId;
			const product = await db.collection('products').findOne({ id: productId });
			res.json(product);
		});

		app.post('/api/users/:userId/cart', async (req, res) => {
			const userId = req.params.userId;
			const productId = req.body.id;

			const existingUser = await db.collection('users').findOne({ id: userId });

			if (!existingUser) {
				await db.collection('users').insertOne({ id: userId, cartItems: [] });
			}

			await db.collection('users').updateOne({ id: userId }, {
				$addToSet: { cartItems: productId }
			});

			const user = await db.collection('users').findOne({ id: req.params.userId });
			const populatedCart = await populateCartIds(user?.cartItems || []);
			res.json(populatedCart);
		});

		app.delete('/api/users/:userId/cart/:productId', async (req, res) => {
			const userId = req.params.userId;
			const productId = req.params.productId;

			await db.collection('users').updateOne(
				{ id: userId },
				{
					$pull: { cartItems: productId },
				}
			);

			const user = await db
				.collection('users')
				.findOne({ id: req.params.userId });
			const populatedCart = await populateCartIds(user?.cartItems || []);
			res.json(populatedCart);
		});

		app.listen(8000, () => {
			console.log('Server is listening on port 8000');
		});

	} catch (error) {
		console.error("An error occurred:", error);
	}
}

start().catch(console.dir);
