import { getSession } from "next-auth/client";
import { connectToDatabase } from '../../../helpers/db'
import { hashPassword, verifyPassword } from '../../../helpers/auth'

async function handler(req, res) {
    console.log(req)
    if (req.method !== 'PATCH') {
        return;
    }

    const session = await getSession({ req: req });
    console.log(session);
    if (!session) {
        res.status(404).json({ message: 'Not authenticated!' });
        return;
    }

    const userEmail = session.user.email;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const client = await connectToDatabase();

    const userCollection = client.db().collection('users');

    const user = await userCollection.findOne({ email: userEmail });
    console.log(user)
    if (!user) {
        res.status(404).json({ message: 'Not found!' });
        client.close();
        return;
    }

    const currentPassword = user.password;
    const passwordAreEqual = await verifyPassword(oldPassword, currentPassword);

    if (!passwordAreEqual) {
        res.status(422).json({ message: 'Invalid password' });
        client.close();
        return;
    }

    const hashedPassword = await hashPassword(newPassword)

    const result = await userCollection.updateOne({
        email: userEmail
    },
        {
            $set: { password: hashedPassword }
        }
    );
    client.close();
    res.status(200).json({ message: 'Password updated' });
}

export default handler;