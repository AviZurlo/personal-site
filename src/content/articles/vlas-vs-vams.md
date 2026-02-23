---
title: 'VLAs vs VAMs: The Architectural Split Defining Robot Foundation Models'
date: '2026-01-26'
description: >-
  Two ways to build robot foundation models — VLAs inherit semantic
  understanding, VAMs inherit physical dynamics. The distinction is a potential
  paradigm shift.
tags:
  - robotics
  - AI
  - foundation-models
  - VLA
  - VAM
source: x
featured: true
---


There are two ways to build a robot foundation model right now. Both take in images and output motor commands. Both leverage internet-scale pretraining. But they're making fundamentally different bets about what kind of knowledge matters for robot control.

**VLAs (Vision-Language-Action models)** inherit semantic understanding from vision-language models (VLMs). They know what things are. Examples: Physical Intelligence's π0 series, NVIDIA's GR00T series, OpenVLA, Google DeepMind's Gemini Robotics.

**VAMs (Video-Action Models)** inherit physical dynamics from video models. They know how things move. Examples: 1X's 1XWM, NVIDIA's Cosmos Policy, mimic-video.

The distinction between the two sounds abstract, but it's a potential paradigm shift for robot foundation models.

## VLA Architecture

A VLA starts with a pretrained VLM like PaLI, LLaMA, or Prismatic. These models have seen billions of image-text pairs from the internet. They understand objects, spatial relationships, and language instructions.

The lifeblood of VLAs is human teleoperation data—thousands of hours of humans remotely controlling robots while cameras record everything. Each timestep gives you a tuple: (camera image, language instruction, motor command).

The training pipeline typically looks something like:

1. Feed the image through the VLM's vision encoder → get visual tokens
2. Feed the language instruction through the VLM's text encoder → get text tokens
3. Process both token sequences through the VLM's transformer layers → get a combined representation encoding the scene and task
4. Feed that representation into the action decoder → get a predicted action
5. Compare predicted action to the ground truth action from the demo, compute loss, backprop

The action decoder is doing supervised imitation learning. It's learning: "When the VLM represents a scene like X, the human demonstrator did action Y."

Notably, the VLM backbone was never trained on actions. It understands scenes and language, but the mapping from understanding to motion has to be learned entirely from robot demonstrations. This is where VAMs are drastically different.

## VAM Architecture

A VAM starts with a pretrained video model like Cosmos-Predict or V-JEPA. These models have seen millions of hours of internet video. They understand how the physical world evolves over time: objects fall, hands grasp things, liquids pour. The video model has no idea what a motor command is—it just knows how the world moves.

The training data for a VAM is also robot demonstrations, but structured as state transitions. Each timestep gives you a tuple: (frame_t, frame_t+1, motor command).

The training pipeline typically looks something like:

1. Take a pair of consecutive frames from a robot demonstration
2. Encode both frames through the (frozen) video backbone → get two latent representations
3. Feed both latents into the Inverse Dynamics Model (IDM) → get a predicted action
4. Compare predicted action to the ground truth action, compute loss, backprop

The IDM is learning something narrower than a VLA's action decoder. It's trying to understand "When the latent representation changes from X to Y, the action that caused it was Z." It's not planning or reasoning about goals—it's just inferring causation from state transitions.

At inference this looks like:

1. Current image → video model imagines the future latent state (what should happen next)
2. [Current latent, imagined future latent] → IDM → predicted action
3. Execute action, get new image, repeat

---

Both architectures require translating representations into motor commands. VLAs use an action decoder. VAMs use an inverse dynamics model. Neither eliminates this step.

But one translation problem may be easier...

**VLA action decoder:** "Given this semantic understanding of the scene, what motion achieves the goal?"

**VAM inverse dynamics model:** "Given these two frames showing a state transition, what action caused it?"

The IDM's job is arguably simpler. It's not planning—it's just asking what happened between two states. The video backbone has already done the heavy lifting of understanding physical dynamics.

## The Empirical Results

The empirical results are starting to favor VAMs.

VAMs can absorb internet-scale video in a way VLAs can't. A VLM learns from static images: it sees a cup, but never sees a cup being picked up, tipped, or dropped. A video model trained on billions of hours of footage has seen all of that. This means the video backbone arrives with far richer priors about physical interaction, which should shrink the amount of robot demonstration data needed during post-training.

The early results back this up:

- **mimic-video** shows 10x sample efficiency over VLA baselines
- **Cosmos Policy** hits 98.5% on LIBERO with shockingly few demos
- **1XWM** trains its entire IDM on just 400 hours of robot data compared to the 10,000+ hours that trained π0

If this holds, it's a huge deal given demo data bottlenecks.

## Open Questions

That said, VAMs aren't a solved problem. A few open questions:

1. **Language grounding:** VLMs are good at following novel language instructions. Can VAMs match this? Video models don't have the same language understanding built in.

2. **Inference speed:** Video models are computationally expensive. 1XWM takes ~12 seconds per action. That's not viable for real-time control. mimic-video and Cosmos Policy are faster, but speed remains a constraint.

3. **Reliability at scale:** The benchmarks look good, but no one has proven VAMs work at 99%+ reliability in production—granted, neither do VLAs. The data efficiency gains could evaporate at the tail of the performance curve.

## The Bet

If I had to place a bet, I'd say all major robot foundation model breakthroughs will be around VAMs.

The reason is simple: the hardest part of robot learning is understanding physical dynamics, and video models have already learned them.
