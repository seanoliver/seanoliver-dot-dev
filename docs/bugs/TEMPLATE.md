# <Short title: what broke, stated as the failure>

**Date:** YYYY-MM-DD **Branch:** <branch> **Caught by:** <what surfaced it — CI
job, browser QA, e2e test, user report>

## Symptom

What was observably wrong, from the outside. Include the exact error message,
failing URL, or wrong output.

## Root cause

The actual mechanism, not the category. Show the offending code/config and
explain why it behaved that way. If the bug was masked for a while, say what
masked it.

## Repro steps

Numbered steps from a known commit to the observable failure.

1. ...

## Fix

What changed and why that change (rather than alternatives). Reference the
commit.

## Verification

How you proved the fix works — commands run and their results, tests that failed
before and pass after.

## Recurrence guardrail

The durable protection: the test, lint rule, comment, or structural change that
fails loudly if the bug pattern comes back.
