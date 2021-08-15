import { mongoClient } from './DB';
import { getDraftById } from './Components/Drafts';

export async function populateDraftEntries(draftId) {
  if (!mongoClient.isConnected()) {
    await mongoClient.connect();
  }

  try {
    const draft = await getDraftById(draftId);
    // console.log(draft);

    const draftParticipantsCollection = mongoClient
      .db('valorant-draft-db')
      .collection(`draft-participants-${draftId}`);

    console.log(draftParticipantsCollection);

    const users = [
      { userId: '68672cd0-acc2-46b6-976c-13bd771b9a9c' },
      { userId: '741a9666-f87c-4a9c-916d-6e3515efe967' },
      { userId: '3fc49b6b-e18c-4d10-95ee-ce2f2f918004' },
      { userId: '167f31a1-0fcd-4e9c-8f7c-dcf748d65820' },
      { userId: '81cf9c2c-64b0-4622-8181-b1d4931dd208' },
      { userId: '5f9c5481-7b00-432e-aac7-5e81d4aafa00' },
      { userId: '7883a6ad-4e5e-4202-b6b8-010ba22ddbb2' },
      { userId: 'fada2f8c-19b9-4785-a357-9204458b95b7' },
      { userId: '3b95e34c-90b2-46a4-b600-38040bb756f8' },
      { userId: 'b7540bca-0d40-4033-9552-c36a73e0d7b9' }
    ];

    const usersCollection = mongoClient
      .db('valorant-draft-db')
      .collection('users');

    for (let i = 0; i < users.length; i++) {
      const enterDate = Math.floor(Date.now() / 1000);

      const user = await usersCollection.findOne({ _id: users[i].userId });

      console.log(user);

      const removeIfExists = await draftParticipantsCollection.findOneAndDelete(
        { _id: users[i].userId }
      );

      console.log(removeIfExists);

      const selectedRoster = [];

      for (let j = 0; j < 5; j++) {
        const randomIndex = Math.floor(Math.random() * draft.players.length);

        console.log(randomIndex);

        selectedRoster.push(draft.players[randomIndex]);
      }

      console.log(selectedRoster);

      const insert = await draftParticipantsCollection.insertOne({
        _id: users[i].userId,
        displayName: user.displayName,
        draftId,
        enterDate,
        entryFee: draft.entryFee,
        selectedRoster,
        userId: users[i].userId
      });
    }
  } catch (err) {
    console.log(err);
  }
}
