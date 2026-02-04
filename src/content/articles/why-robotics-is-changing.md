---
title: "Why Robotics Is Changing"
date: 2026-01-14
description: "Robot foundation models are transforming robotics economics — from caged machines to generalizing systems that learn."
tags: ["robotics", "AI", "foundation-models"]
source: "x"
featured: true
---

Robot foundation models are changing robotics.

A robot foundation model is a single AI system that takes in what a robot sees and outputs what it should do, enabling a robot to act autonomously without a human directing every movement.

Before robot foundation models, engineers wrote explicit rules: if sensor reads X, move arm Y degrees. Every situation required its own programming. Motion planning algorithms could handle well-defined tasks, but anything unexpected meant the robot was stuck.

This created major limitations:

1. **Environments had to be controlled.** A single unexpected object or slight change in lighting could cause complete failure. Factories built cages around robots partly for safety, partly because the robots couldn't adapt to anything outside their script.

2. **Use cases had to be high-value.** Engineering every behavior by hand is expensive. Only customers with deep pockets (eg. automotive manufacturers, semiconductor fabs) could justify the cost.

3. **Scaling was painful.** Teaching a robot to do one new task meant nearly as much work as the first. There was no compounding, no leverage from what the robot already knew.

And so robots have literally been caged up in terms of capabilities.

Then came robot foundation models...

## How Robot Foundation Models Work

Instead of hand-coding rules, developers collect robot-specific data (eg. the position of limbs, joint movements, gripper forces) and label it with relevant context like "this is how to pick up a cup." Feed it all into a large AI model and the model learns which actions correlate with successful outcomes. No more hard-coding what success looks like. Just mix data and compute (sort of).

Even more powerful: you can build on top of pretrained AI models, such as vision-language models (VLMs). VLMs already know what a cup looks like and what "put the cup on the shelf" means. Add robot-specific data and the model starts combining concepts it learned from the internet with real physical actions. All of a sudden a robot is doing things it's technically never seen before. This is called generalization.

## Why Generalization Changes Everything

**First, robots become more resilient.** When a robot makes a mistake, like dropping a shirt it's trying to fold, it can recover even if it's never seen that exact situation in training. This matters for any real-world environment where mistakes happen, which is pretty much all of them.

**Second, robots become better learners.** A model that generalizes picks up new tasks with far less data than one learning from scratch. It can even make use of data that would otherwise be useless. Demonstrations that are slightly off-task or collected under different conditions suddenly contribute to learning.

For example, it would be great if we could use all the videos of humans doing things to train robots. Unfortunately, ego-centric data (ie POV videos of humans performing tasks) isn't very useful by itself. That changed with scale. Physical Intelligence showed that adding ego-centric data to their foundation model significantly outperformed the model without it.

**Third, robots become cheaper to deploy.** Instead of programming every edge case, you collect representative data and let the model figure out the rest. This lowers the barrier dramatically not just in cost, but in the knowledge and skillset required to build something useful.

## The New Economics of Robotics

These shifts are radically changing the economics of robotics companies.

As robot foundation models improve and generalization emerges, smaller robotics businesses can deploy software that enables robots to do new things far more cheaply. Collect data for the task you want, fine-tune a model, and go.

And as software capabilities accelerate, hardware costs are dropping rapidly. Seven years ago, a quadruped robot cost $50k. Today, a humanoid—significantly more sophisticated, more capable—costs under $6k.

Both sides of the equation are improving at once. Factor in an immense amount of capital ($40B in 2025) and a migration of talent to robotics companies, and acceleration becomes inevitable.

## What's Next

There's still a gap between foundation model research and reliable real-world deployment. But that gap is closing and the next few years will look very different from the last few decades.

Soon an entrepreneur may be able to solo-bootstrap an autonomous robot for a useful task: collect data with hardware costing under $5k, fine-tune a foundation model, reach high reliability, and start automating physical work.

Looking further out, beautifully designed general-purpose robots will ship with broad capabilities out of the box.

This future is approaching fast. Following the researchers and companies driving these developments has shaped my own thinking about what's next. If you're building toward this future—or just starting to think about it—I'd love to connect.
