import MeetupDetail from "@/components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import Head from "next/head";

function MeetupDetails(props) {
  return (
    <Fragment>
        <Head>
            <title>{props.meetupData.title}</title>
            <meta name="description" content={props.meetupData.description}></meta>
        </Head>
        <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
        />
    </Fragment>
  );
}

// nextJs needs to generate all versions of this dynamic page in advance
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://lynskey123:test123@cluster0.mkv0aai.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),
    //key tells nextjs if your paths array contains all supported parameter values or just some of them
    fallback: false,
  };
}

export async function getStaticProps(context) {
  // fetch data for single meetup

  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://lynskey123:test123@cluster0.mkv0aai.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  }); //convert string id to mongodb objectid format
  console.log(selectedMeetup);

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
