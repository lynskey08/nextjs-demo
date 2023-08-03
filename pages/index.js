import MeetupList from "@/components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        ></meta>
      </Head>
      <MeetupList meetups={props.meetups}></MeetupList>
    </Fragment>
  );
}

//this function will not run during build process, but instead always on the server after deployment
// export async function getServerSideProps(context){
//     const req = context.req;
//     const res = context.res;

//     // fetch data from an API
//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     };
// }

//reserved function name - executes function during pre-rendering process
export async function getStaticProps() {
  // fetch data from an API

  const client = await MongoClient.connect(
    "mongodb+srv://lynskey123:test123@cluster0.mkv0aai.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find().toArray();
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1, //number of seconds nextjs will wait until it regenerates this page for an incoming request
  };
}

export default HomePage;
