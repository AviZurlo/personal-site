---
title: "What Machine Shops Taught Me About Robotics"
date: 2026-09-24
description: "Lessons from five months of building robots and meeting machine shop owners: where robot learning falls short, what customers need, and what comes next."
tags: ["robotics", "manufacturing", "robot-learning", "automation"]
source: "x"
featured: true
---

![American eagle sign commemorating 250 years of the United States](/images/articles/what-machine-shops-taught-me-about-robotics/cover.webp)

Six months ago, I started a robotics company.

The idea had been building for over a year, informed by my experience investing in robotics companies and learning about the industry in 2025. One of my core insights was that robot learning was expanding robot capabilities faster than the industry could deploy solutions. In May I shared publicly the business model I envisioned for a robotics neo-integrator that could bridge the gap.

[The Rise of the Neo-Integrator](/articles/the-rise-of-the-neo-integrator)

In short, traditional systems integrators deploy robots through expensive custom engineering. A neo-integrator leverages robot learning to deploy robots faster and cheaper.

The playbook I envisioned was first, establish an industry wedge and deploy teleoperated robots that earn revenue and generate training data assets. Then use robot learning and foundation models to expand operating margins (move unit costs from teleoperation to inference). Finally, as frontier capabilities expanded, ride the wave of zero-shot general intelligence while owning a fleet of cash generating robot workers.

Over the past five months I put this model to the test. I split my time 70/30 between customer discovery and engineering. I focused my customer discovery on high-mix machine shops in New England. I met with 50 shop owners and spoke to 100+ more over the phone. I tested hardware, including OpenArm, YAM Ultras, and reBot’s B601-RS, evaluated teleoperation platforms and managed service providers, collected training data, trained narrow policies and fine tuned open source foundation models. I had an awesome summer intern and friends who helped me along the way.

Ultimately I was testing whether robot learning could reliably perform useful work for machine shops, and whether they would pay for deployments.

Below is what I’ve learned and what I think it means for the next few years in robotics.

## What I learned from machine shops

High-mix machine shops felt like the right market for a few reasons. They’re labor intensive, benefit from industry tailwinds (reshoring, industrialization, wartime prep, and government funding), have technology minded owners, and touch literally everything produced in the US. It also helped that machines are awesome.

Fortunately, I spent my summer in the Boston area, home to 2,500+ shops.

![Collage of New England machine shops visited during customer discovery](/images/articles/what-machine-shops-taught-me-about-robotics/machine-shop.jpg)

*more flags*

I started with cold calls but after dealing with too many gatekeepers, I started knocking doors.  I really love the door-to-door grind. As a kid I knocked on doors for yard work across the New England seasons, and in college I did more "professional" door sales and recruiting. Eventually you learn to love even getting told to fuck off. And the door knocking went really well.

On about half of my visits, I spoke with an owner or GM, and one in four visits led to a meeting lasting 30min+. When the owner wasn’t available, I left my contact info and followed up by phone, reaching an owner on about half of those calls.

All in, I met with 50 owners and collected close to 100 hours of rich customer research, which led to two damning insights.

**1. Good machinists do a lot more than push buttons.** There’s a reason everyone is up in arms about the scarcity of machinists in the US. It’s because they’re *skilled* workers, and you can’t really replace a whole one with a robot.

When I started this customer discovery, I imagined a guy standing at a machine, loading metal stock, pushing buttons, waiting around for a screeching alarm, then unloading a finished part before starting all over again. I can attest that there are some machinists that match this image, but they are few. A good machinist tweaks CAD designs, writes CAM programs, mentally visualizes toolpaths and geometries, inspect parts and tolerances, and monitors machines with a tuned ear trained to pick up subtle pitch changes indicating dull or broken tool bits. They also play a meaningful role in front office work quoting jobs and maintaining customer relationships. *That* is why the industry is scrambling to capture knowledge from the retiring generation of craftsmen. It’s also why robots tending machines aren’t a complete solution.

![Diagram of a skilled machinist’s work, from CAD and CAM programming to inspection, machine tending, and customer relationships](/images/articles/what-machine-shops-taught-me-about-robotics/machinist.jpg)

At best a robot replaces half of a good machinist, but ask any floor lead and they’ll probably say machine tending is a small fraction of the work that takes place day-to-day. Needless to say, this makes the ROI calculation a lot weaker, not to mention, machine tending itself is typically the lowest value units of labor in the operation of a shop.

Customers did see value in a machine tending robot unlocking a skilled machinist to focus higher value work such as setups and inspection. But implementing a machine tending robot also means changing the operating model of the business.

Roughly, this looks like skilled machinists handling setup and robots handling tending. In the extreme, one could imagine two nearly identical facilities: one where skilled machinists develop and validate setups, and another where robots handle production. Machinists would iterate on tooling and CAM programs, and inspecting parts until the meet spec. That setup would then be physically replicated on an identical machine in the production facility. Keeping the tooling and programs consistent across both facilities would create all kinds of headaches, but the model seems plausible just not in the near to medium term, considering all the other problems machine shops face.

**2. Robots don’t solve the pressing problems.** Even if I could have delivered a perfectly reliable machine tending robot, it wasn't near the top of any owner's list of priorities. Most machine shops have more fundamental modernization problems to solve first.

To name a few, implementing and operating a modern ERP, buying newer machines (plenty of shops still have manual machines or janky PLCs), purchasing or upgrading inspection equipment, and automating front office work like quoting. Some shops I visited didn’t even have a working computer on site. And even the shops with all the above in order would rather invest in consultants for ISO certifications and ITAR registrations (i.e. compliance paperwork and ops that unlocks new customers and revenue) before purchasing a robot arm.

That’s not to say labor constraints aren’t real, [data clearly says otherwise](https://themanufacturinginstitute.org/manufacturers-need-as-many-as-3-8-million-new-employees-by-2033/). But I think the machine shop industry needs to churn through another stage of technological evolution before we see widespread adoption of robotics by incumbents. In the meantime, I think that presents a hell of an opportunity for new machine shops to get a major head start.

There’re dozens of smaller lessons and insights I picked up from these conversations but these are the big two. If you’re exploring this area, I’m happy to chat in further detail.

## What I learned about robotics

**1. Teleoperation is slow.**

Remote teleoperation was core to my thesis, enabling quick deployments with no learned policy nor classical programming, while earning revenue and generating data. What I found was a fragmented and integration heavy tech stack. I was able to glue together networking tools, managed service providers with trained teleoperators, and custom task management. It wasn’t pretty but it worked and I ran weeks of remote teleoperation from Mexico, Argentina, and India to my garage in Boston. But this wasn’t the fatal problem for remote teleoperation.

No matter how low I got my latency, remote teleoperation was never fast enough for the high mix machine tending work I was targeting. At best, remote teleoperation took twice as long as a human doing the same task, and often ten times as long. That meant idle machines and lost production, quickly degrading the ROI of a robot.

One solution around speed limitations was to enable off-hour utilization e.g. robots run the shop at night. But as mentioned above, this comes with a complete overhaul to the operating model.

**2. Learned policies are unreliable.**

On the robot learning side, I trained policies (ACT and fine tuned open source foundation models) on moderately sized datasets (~5-20hrs), mostly from GELLO-style teleoperation. I was able to produce reliable basic pick and place policies, but failed on complex geometries and multi-step tasks. Worse, I couldn’t reliably diagnose failures and I had underestimated how much ML experience it would take. I know a handful of solutions are under development now to solve this observability problem and with some real ML expertise I don’t think these are insurmountable engineering problems, but they do require a meaningful  investment I wasn’t ready to make given my customer findings.

Ultimately my robots never left the garage.

![Robotics work in the garage workshop](/images/articles/what-machine-shops-taught-me-about-robotics/robot-workshop.jpg)

*special thanks to Josh and Thomas for their help this summer*

## The next few years of robotics

I still believe there’s a market for robot learning and foundation models beyond machine shops and the deployment strategy I tested. And I’m very bullish on greenfield machine shops (e.g. Forge Automation)

However, in the near term, if I were to build a neo-integrator or “applied robotics” company today, I’d focus on finding value creation opportunities outside of strict low-cost labor replacement such as quality control and observability. There's still a lot of work to be done before labor replacement based strictly on lower-costs is viable.

As for what's achievable today, I see a lot of value in supplementing / augmenting existing robot solutions and methods with robot learning. For example, a high throughput packout station may use a classically programmed cobot arm for the bulk of the workload and a robot foundation model handles failure cases or an LLM-based robot harness helps reprogram a grasp for a new object geometry. And let’s not forget pricing innovations. Traditional robot systems integration is still broken, and the company that figures out an operating model for recurring robot reprogramming will fare very well, all technological advancements aside.

## What’s next for me

I’m going to continue working with a few wonderful business owners I met, mostly focused on more primitive modernization work. And I'm pushing ahead to further understand the intersection of “physical AI” and manufacturing – whatever that is.

If you’re building there, I’d love to talk.

---

[Originally published on X](https://x.com/avizurlo/status/2103193937200476234).
