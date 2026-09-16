"use client";

import Link from "next/link";
import { motion } from "motion/react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  return (
    <section className="rule-lines border-b border-ink/10 px-3 py-20 md:px-6 md:py-28 bg-paper">
      <motion.div
        className="mx-auto max-w-4xl"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p variants={item} className="font-mono text-sm text-ink-soft">
          Entry No. 001
        </motion.p>
        <motion.h1
          variants={item}
          className="mt-3 font-display text-4xl leading-[1.1] font-medium md:text-6xl"
        >
          Stop debugging the same bug twice.
        </motion.h1>
        <motion.p variants={item} className="mt-6 max-w-xl text-lg text-ink-soft">
          Bug Diary is a log of what has failed, what you have tried, and what has worked so that six months later, you don't have to relearn what happened the last time.
        </motion.p>
        <motion.div variants={item} className="mt-9 flex items-center gap-4">
          <Link
            href="/sign-up"
            className="rounded-sm bg-ink px-5 py-2.5 font-mono text-sm text-paper transition-colors hover:bg-ink/85"
          >
            Start your log
          </Link>
          <Link
            href="/sign-in"
            className="font-mono text-sm text-ink-soft underline decoration-ink/30 underline-offset-4 hover:text-ink"
          >
            Sign in
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
