"use client";

import { motion } from "motion/react";

const ENTRIES = [
  {
    field: "Error / symptoms",
    body: "Paste the stack trace if available, or describe what failure is observed. What did the user see?",
  },
  {
    field: "What I tried",
    body: "All attempts at diagnosing or fixing the problem, in order, including those that did not work.",
  },
  {
    field: "Root cause",
    body: "Once discovered, record what really happened. The cause may be unrelated to the initial error.",
  },
  {
    field: "Solution",
    body: "The solution or fix, if any. This should save time for future occurrences of the same problem.",
  },
];

export function Features() {
  return (
    <section className="border-b border-ink/10 px-3 py-16 md:px-6 bg-amber-50">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="font-display text-2xl font-medium"
        >
          Every entry follows the same structure
        </motion.h2>
        <dl className="mt-8 divide-y divide-ink/10 border-t border-ink/10">
          {ENTRIES.map((entry, i) => (
            <motion.div
              key={entry.field}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="grid grid-cols-1 gap-1 py-5 md:grid-cols-[220px_1fr] md:gap-6"
            >
              <dt className="font-mono text-sm text-ink-soft">
                {entry.field}
              </dt>
              <dd className="text-ink">{entry.body}</dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
