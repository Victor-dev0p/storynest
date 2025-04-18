import Link from "next/link";
import React from "react";
import { BsAwardFill } from "react-icons/bs";
import { TbBrandMyOppo } from "react-icons/tb";
import { CgMediaPodcast } from "react-icons/cg";
import { FaArrowRightLong } from "react-icons/fa6";

const page = () => {
  return (
    <main className=" py-2">
      <h1 className="py-10 lg:m-10 max-lg:text-center text-xl uppercase font-serif">
        About Us
      </h1>
      <div className="lg:m-10 m-5 flex items-center  gap-3 max-lg:flex-col">
        <span className="max-md:grid max-lg:space-y-20 ">
          <p className="text-4xl max-lg:text-center">
            Storynest – <br /> Where Every Story Finds Its Home
          </p>
          <p className="max-md:-mt-15  lg:py-5 lg:w-1/2">
            Storynest is a platform that celebrates the art of storytelling, For
            readers, Storynest opens the door to a universe of compelling and
            diverse stories, waiting to ignite your imagination and tug at your
            heartstrings.
          </p>
          <button className=" py-4 px-8 max-md:w-full mb-5 rounded-md bg-green-950 text-white max-lg:items-center ">
            <Link href="/UploadStory">Get Started</Link>
          </button>
        </span>

        <span>
          <img
            src="/bg.jpg"
            alt="Storynest image"
            className="lg:justify-center max-lg:mx-auto max-md:-mt-10 max-lg:w-full  max-md:py-10"
          />
        </span>
      </div>

      <div className="border">
        <span className="lg:m-5 border border-red-500">
          <h1 className="text-2xl max-md:text-lg text-center uppercase font-bold lg:m-5 m-2">
            Uniting Storytellers, One Tale at a Time
          </h1>

          <p className="lg:w-1/2 mx-auto max-md:m-5">
            At Storynest, every story has a place, and every storyteller has a
            voice. Our platform is built to bridge the gap between imagination
            and connection—offering a home where creators can share their
            stories and readers can lose themselves in the magic of words.
            Whether you're looking to inspire, entertain, or simply be heard,
            Storynest is your space to connect with a community that values and
            celebrates the power of storytelling. Let's make stories together,
            one tale at a time..
          </p>
          <article className="py-5 text-center">
            <h1 className="text-3xl font-bold text-center">Library</h1>
            <p className="py-5 lg:w-1/2 mx-auto max-md:m-5">
              Storynest offers a wide range of genres and themes, from fantasy
              and romance to mystery and science fiction. Our library is a
              treasure trove of stories that cater to every taste and
              preference, ensuring that every reader finds a tale that resonates
              with them. Whether you're looking for a gripping thriller, a
              heartwarming romance, or an epic adventure, Storynest has you
              covered.
            </p>
            <img
              src="/bg.jpg"
              alt="Storynest image"
              className=" max-lg:mx-auto max-md:-mt-10  max-md:mx-auto m-5"
              width={400}
              height={400}
            />
          </article>
          <span className="grid pap-8 md:grid-col-2 md:items-center lg:grid-cols-3 gap-5 m-5">
            <article>
              <h1 className="text-3xl font-bold">Children Library</h1>
              <p className="py-5">
                Storynest offers a wide range of genres and themes, from fantasy
                and romance to mystery and science fiction. Our children's
                library is a treasure trove of stories that cater to every taste
                and preference, ensuring that every reader finds a tale that
                resonates with them. Whether you're looking for a gripping
                thriller, a heartwarming romance, or an epic adventure,
                Storynest has you covered.
              </p>
              <img
                src="/bg.jpg"
                alt="Storynest image"
                className=" max-lg:mx-auto max-md:-mt-10  max-md:mx-auto"
                width={400}
                height={400}
              />
              <button className="text-blue-900 py-5 ">Read More... </button>
            </article>

            <article>
              <h1 className="text-3xl font-bold">Teen Library</h1>
              <p className="py-5">
                Storynest offers a wide range of genres and themes, from fantasy
                and romance to mystery and science fiction. Our teen library is
                a treasure trove of stories that cater to every taste and
                preference, ensuring that every reader finds a tale that
                resonates with them. Whether you're looking for a gripping
                thriller, a heartwarming romance, or an epic adventure,
                Storynest has you covered.
              </p>
              <img
                src="/bg.jpg"
                alt="Storynest image"
                className=" max-lg:mx-auto max-md:-mt-10 max-lg:w-full"
                width={400}
                height={400}
              />
              <button className="text-blue-900 py-5 ">Read More... </button>
            </article>

            <article>
              <h1 className="text-3xl font-bold">Adult Library</h1>
              <p className="py-5">
                Storynest offers a wide range of genres and themes, from fantasy
                and romance to mystery and science fiction. Our adult library is
                a treasure trove of stories that cater to every taste and
                preference, ensuring that every reader finds a tale that
                resonates with them. Whether you're looking for a gripping
                thriller, a heartwarming romance, or an epic adventure,
                Storynest has you covered.
              </p>
              <img
                src="/bg.jpg"
                alt="Storynest image"
                className=" max-lg:mx-auto max-md:-mt-10 max-lg:w-full"
                width={400}
                height={400}
              />
              <button className="text-blue-900 py-5 ">Read More... </button>
            </article>
          </span>
        </span>
      </div>

      <div className="">
        <h1 className="text-center font-bold text-xl uppercase">Our mission</h1>
        <p className="text-center text-3xl py-2">
          – Empowering Stories, Enriching Lives
        </p>
        <p className="center lg:w-1/2 mx-auto">
          Our mission is to create a platform that celebrates the art of
          storytelling and connects readers and writers from around the world.
          We believe that stories have the power to inspire, entertain, and
          transform lives, and we're committed to providing a space where
          creators can share their stories and readers can discover new worlds
          and perspectives. At Storynest, we're on a mission to unite
          storytellers, one tale at a time.
        </p>
      </div>
      <div className="m-5 py-20">
        <span className="flex items-center justify-between gap-10 max-lg:grid py-5">
          <img
            src="/bg.jpg"
            alt="team image"
            className="max-lg:mx-auto max-lg:w-full lg:ml-20"
            width={500}
            height={500}
          />
          <span className="py-5 lg:w-1/2">
            <h1 className="uppercase font-bold lg:text-center">
              Our team and our social impact
            </h1>
            <p className="text-4xl lg:justify-end lg:text-center py-5">
              Creating a community for impact
            </p>
            At Storynest, we believe in the power of stories to create change
            and make a difference. That's why we're committed to using our
            platform to support social causes and empower marginalized voices.
            We partner with organizations and initiatives that promote literacy,
            education, and social justice, and we're dedicated to creating a
            community that values diversity, inclusion, and equality. By sharing
            stories that inspire, inform, and challenge, we're working to create
            a more compassionate and connected world, one story at a time.
          </span>
        </span>
      </div>
      <div className="">
        <h1 className="text-center text-4xl">Learn more about storynest</h1>
      </div>
      <div className="lg:flex max-lg:grid-cols-2 md:grid  gap-7 py-10 items-center justify-center m-20">
        <div className="py-5">
          <BsAwardFill />
          <h1 className=" text-xl">Award-winning support</h1>
          <p className="w-1/2">
            Get the help you want with 24/7 support—before, during, and after
            your trial.
          </p>
          <span className="flex items-center py-2 text-blue-800 underline font-bold">
            <p>Contact support</p>
            <FaArrowRightLong />
          </span>
        </div>
        <div className="py-5">
          <TbBrandMyOppo />
          <h1 className=" text-xl">Career opportunities</h1>
          <p className="w-1/2">
            Learn how you can have an impact by exploring <b /> opportunities at
            Storynest.
          </p>
          <span className="flex items-center py-2 text-blue-800 underline font-bold">
            <p>Explore career</p>
            <FaArrowRightLong />
          </span>
        </div>
        <div className="py-5">
          <CgMediaPodcast />
          <h1 className="text-xl">Press and media</h1>
          <p className="w-1/2">
            Find press releases, executive team bios, and more.
          </p>
          <span className="flex items-center py-2 text-blue-800 underline font-bold">
            <p>View press</p>
            <FaArrowRightLong />
          </span>
        </div>
      </div>

      <div className="text-center space-y-5 py-5">
        <h1 className="text-2xl font-serif max-md:text-xl lg:w-1/2 mx-auto w-1/2">
          {" "}
          Try Storynest for free, and explore all the tools and services you
          need to start, run, and grow your business.
        </h1>
        <button className="border py-5 px-10 rounded-sm bg-green-950 text-white">
          Start free trial
        </button>
      </div>

      <div className="space-x-10 m-5  lg:mx-auto lg:flex max-lg:grid-cols-2 max-md:text-sm md:grid  py-10 w-2/3 lg:mr-10 ">
        <div className="space-y-2">
          <h1 className="py-5 font-bold">Storynest</h1>
          <p>About</p>
          <p>our team</p>
          <p>community growth</p>
        </div>

        <div className="space-y-2">
          <h1 className="py-5 font-bold">News and Media</h1>
          <p>Press and Media</p>
          <p>Partners</p>
          <p>Affiliates</p>
          <p>Legal</p>
          <p>Platform Updates</p>
        </div>

        <div className="space-y-2">
          <h1 className="py-5 font-bold">Support</h1>
          <p>Storyteller Support</p>
          <p>Help Center</p>
          <p>Hire a Collaborator</p>
          <p>Storynest Community</p>
          <p>Events and Workshops</p>
        </div>

        <div className="space-y-2">
          <h1 className="py-5 font-bold">For Creators</h1>
          <p>Storynest Creators</p>
          <p>Developer Resources</p>
          <p>Learning Hub</p>
        </div>

        <div className="space-y-2">
          <h1 className="py-5 font-bold">Our Products</h1>
          <p>Storynest+</p>
          <p>Story Collections</p>
          <p>Interactive Features</p>
        </div>

        <div className="space-y-2">
          <h1 className="py-5 font-bold">Our Solutions</h1>
          <p>Online Story Builder</p>
          <p>Creative Website Builder</p>
          <p>Storytelling Tools</p>
        </div>
      </div>
    </main>
  );
};

export default page;
