"use client"

import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { FaChevronDown } from "react-icons/fa";
import { useState } from "react";

const faqs = [
  {
    question: "What is Storynest?",
    answer: "Storynest is a platform where storytellers can share their narratives and connect with a community of readers.",
  },
  {
    question: "Is Stornest free to use?",
    answer: "Yes, Storynest is free for readers and writers. However, there may be premium features in the future.",
  },
  {
    question: "Can I publish my own stories?",
    answer: "Absolutely! Anyone can sign up and start publishing their stories for the community to enjoy.",
  },
  {
    question: "How do I interact with other users?",
    answer: "You can comment on stories, follow authors, and join discussions in the community forum.",
  },
  {
    question: "Can I edit my published stories?",
    answer: "Yes, you can edit and update your stories anytime from your dashboard.",
  },
  {
    question: "What genres of stories are available on Stornest?",
    answer: "Storynest features a wide range of genres, including fantasy, romance, mystery, sci-fi, action, horror, and more.",
  },
  {
    question: "Can I read stories offline?",
    answer: "Currently, stories are available for online reading, but we may introduce an offline reading feature in the future.",
  },
  {
    question: "How do I discover new stories?",
    answer: "You can browse stories by genre, search by keywords, or explore trending and recommended stories based on your reading history.",
  },
  {
    question: "Are there writing contests on Stornest?",
    answer: "Yes! Storynest occasionally hosts writing contests where writers can showcase their talent and win prizes.",
  },
  {
    question: "Can I collaborate with other writers?",
    answer: "Yes, Storynest allows co-authoring features where multiple writers can collaborate on a single story.",
  },
  {
    question: "Is there a rating or review system for stories?",
    answer: "Yes, readers can rate stories and leave reviews to help authors improve their work and guide other readers.",
  }
];

export default function Faqs() {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Frequently Asked Questions</h1>
      {faqs.map((faq, index) => (
        <Accordion key={index} expanded={expanded === index} onChange={handleChange(index)}>
          <AccordionSummary
            expandIcon={<FaChevronDown className={`transform transition-transform ${expanded === index ? "rotate-180" : "rotate-0"}`} />}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded"
          >
            <h2 className="text-lg font-semibold">{faq.question}</h2>
          </AccordionSummary>
          <AccordionDetails>
            <p className="text-gray-700">{faq.answer}</p>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}