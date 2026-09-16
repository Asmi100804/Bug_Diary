"use client";

import { motion } from "motion/react";

export function ExampleBug() {
  return (
    <section className="px-3 py-16 md:px-6">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="font-display text-2xl font-medium"
        >
          What an entry looks like
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4 }}
          className="mt-8 border border-ink/15 transition-shadow duration-300 hover:border-ink/30"
        >
          <div className="flex items-center justify-between border-b border-ink/15 bg-paper-dim px-5 py-3">
            <span className="font-mono text-sm text-ink-soft">BUG-042</span>
            <span className="font-mono text-xs text-red">difficulty 4/5</span>
          </div>

          <div className="space-y-5 px-5 py-5 bg-amber-50">
            <h3 className="font-display text-xl font-medium">
              Stale data after optimistic update rollback
            </h3>

            <div>
              <p className="font-mono text-xs text-ink-soft">Symptoms</p>
              <p className="mt-1 font-mono text-sm text-ink">
                List reverted to old state, but the server had already saved the change.
              </p>
            </div>

            <div>
              <p className="font-mono text-xs text-ink-soft">What I tried</p>
              <ul className="mt-1 space-y-1 text-sm">
                <motion.li
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="text-ink-soft line-through decoration-2 decoration-red/50"
                >
                  Refetching on every mutation — masked it, didn&apos;t fix it
                </motion.li>
                <motion.li
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="text-ink"
                >
                  Traced the rollback logic to a stale closure over the cache key
                </motion.li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-xs text-slate">Root cause</p>
              <p className="mt-1 text-sm text-ink">
                The mutation&apos;s error handler closed over the query key from the
                first render, not the current one.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {["react-query", "stale-closure", "optimistic-updates"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-sm border border-ink/15 px-2 py-0.5 font-mono text-xs text-ink-soft"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
