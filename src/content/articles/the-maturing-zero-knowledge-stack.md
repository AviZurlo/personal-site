---
title: "The Maturing Zero-Knowledge Stack"
date: 2023-10-15
description: "A framework for ZK developer platforms, proof systems, and the path to ubiquitous verifiable computation."
tags: ["crypto", "research"]
source: "original"
featured: false
---

In the landscape of applied cryptography, few advancements have garnered as much attention as Zero-Knowledge Proofs (ZKPs). These cryptographic constructs have emerged as a beacon of innovation for blockchains, offering a new toolset to tackle challenges of privacy, scalability, and developer experience. ZKPs have effectively scaled Ethereum blockspace, facilitated trustless cross-chain communications, safeguarded private identities, and enabled private transactions on-chain. Looking ahead, the prospects for ZKPs appear even more promising. The convergence of easy-to-use developer tools and growing perceived usefulness for ZKPs is a clear indication of technology adoption.[^1]

This tidal wave of innovation isn't happenstance. ZK research has occurred at an impressive rate with the help of over $1.2B of venture capital. The visionaries behind this surge see ZKPs not only as a solution to blockchain's most pressing problems but as a bridge to uncharted technological domains.

In essence, ZKPs are a scalable solution to computational integrity and privacy. Specifically, they allow one party to verify that another party has correctly executed a computation without revealing any information about that computation. I believe ZKPs and verifiable computation are foundational technologies for a more resilient, permissionless, and sovereign internet. Furthermore, I believe this technology is on the brink of a massive adoption cycle as it ramps out of its R&D phase into an ascent of tangible business value.

This transition is driven by a combination of factors enhancing both the usability and perceived usefulness of ZKPs.

*Usability (ease-of-use):*

- **Developer tooling,** specifically no-ZK-necessary tooling that abstracts away the many layers of complexity ZKPs are built upon. Platforms such as general-purpose zkVMs and circuit compilers let developers build ZK applications with no prior ZK knowledge.
- **Performance optimization** of proof systems has occurred at an incredible pace, in part thanks to business demand for blockchain scaling solutions. ZK research has advanced faster than anyone could have imagined — it was just 11 years ago that the first widespread application of SNARKs was implemented.[^2] Today, there are an abundance of proof systems each with their own tradeoffs, with two developments showing extraordinary promise: lookup tables and folding.
- **Mature ecosystems** of developers, engineers, and researchers have flourished around the work of building ZK applications and proof systems. This rich community has generated a wealth of knowledge and, arguably more importantly, has played a critical role in battle-testing tools and systems that were pure research just a short time ago.[^3] Blockchains have served as the perfect breeding ground for stress-testing ZK systems.

*Perceived usefulness:*

- **Scaling blockchains** has been one of the most contested and important challenges the blockchain industry has attempted to solve — ZKPs hold the answer. For scaling blockspace there are ZK-rollups; for ensuring trustless interoperability there are ZK-bridges.
- **Augmenting blockchains** is a natural progression, enabled by zkVMs, circuit compilers, storage proofs, data coprocessors, and on-chain privacy primitives.
- **Rise of ZKML** — the application of ZKPs to machine learning inference has emerged as one of the most compelling non-blockchain use cases, though the adoption curve is materially earlier than zkEVMs. Opening a new design space for verifiable AI is the long-term ambition; getting there requires solving real technical bottlenecks first.

I expect to see a positively reinforcing dynamic between perceived ease of use and perceived usefulness for ZK applications over the next several years. In this piece, I share a framework for thinking about the usefulness of ZK and the application design space in relation to Ethereum. I then reason through how ZK developer platforms have evolved, their impact on ZK ease-of-use, and where they might be heading. Finally, I conclude with an overview of proof systems and share why I believe computational overhead for ZK will continue to plummet.

One caveat worth holding: the causality here has historically run the opposite direction. Ethereum scaling was worth hundreds of millions to solve, and that demand signal is what funded the proof system R&D. Starkware's $100M Series D in 2022 wasn't a bet on abstract cryptography — it was a bet on a specific, expensive problem with a clear customer. For ZKPs to have the same trajectory outside of blockchains, an equivalent demand signal needs to materialize. It isn't obvious yet what that is. The optimism in this piece is real, but it's conditional.

## Ease-of-Use: Developer Platforms

Zero-knowledge proofs verify the computational integrity of a program — for example, this state has been calculated correctly given this state transition function and this original state. Fundamentally, all ZK computations require the presence of an arithmetic circuit. Manually writing arithmetic circuits is very, very technically demanding.

Broadly speaking, there are two frameworks in which we can categorize a circuit:

1. The program is the circuit ("app-specific circuit")
2. The program is an input into a circuit that is a virtual machine ("zkVM")

Analogous to app-specific chains, app-specific circuits choose performance over generalizability — only a single program can run on this circuit, however it can be done with the least amount of computational overhead. This comes at the expense of significant barriers to entry, demanding knowledge of many complex domains including constraint system programming, non-trivial SNARK construction, finite fields, elliptic curves, and polynomial arithmetic.[^4] Despite the high technical barriers to entry, an app-specific circuit was the best approach many ZK applications had when they began their development journey. For a very particular type of developer, writing R1CS circuits may be the ideal afternoon. But for the vast majority, this sounds like Assembly hell.

To ease the pain of manually writing circuits, cryptographers built a plethora of circuit tools from libraries to circuit compilers. Organizations such as Arkworks and O(1) Labs have built libraries for ZK application components and frameworks, while others such as EZKL have focused on more bespoke libraries for ZKML use cases. Circom, built by iden3, offers a great solution for compiling R1CS circuits. The nil Foundation's zkLLVM compiles a program from Rust or C++ into a custom circuit and offers prover services through their proof market. The efficiency gains driven by contemporary ZKP protocols have made it feasible to prove full virtual machines — zkVMs — removing the need for developers to possess any ZK expertise.

### What are zkVMs?

A zkVM works like any other virtual machine (VM); it executes a program or transaction according to a specific computational model (called an instruction set architecture or ISA), along with an initial state, and computes the final state.[^5] We can make a VM provable by adding a witness statement as an input to the machine (typically the execution trace of a program) and constructing a circuit that checks the correctness of the execution of the ISA itself.

At a high level, we can break zkVMs into an instruction set architecture (ISA) that defines the operations of a machine (or CPU) and a proof system that handles the preparation and construction of a proof. There are two important considerations:

- ISAs describe the fundamental operations a CPU can execute (i.e., opcodes, data types, memory consistency, etc.)
- They influence the programming languages you can natively support for execution

All zkVMs must prove that the ISA was run correctly AND that the program (input) moved the state from the initial to final stage — this is why zkVMs have so much overhead. The larger the total sum of operations (size and complexity) across both the program and ISA, the more overhead the zkVM will have. Fortunately, there are tailwinds that should boost the performance of zkVMs, such as hardware acceleration and new ZK algorithms.

A remarkable feature of zkVMs is their capacity to create proofs for diverse programs. For example, Risc Zero's zkVM natively supports the Rust programming language, which allows developers to seamlessly import Rust crates as part of their ZK application. Many other ZK developer platforms also support existing programming stacks, which fundamentally shatters the technical barriers to entry for building a ZK application. I believe this newfound ease of use — by supporting existing programming paradigms — can 10–100x the developer market for ZK applications.

### State of ZK Developer Platforms

Today, the most popular zkVM target is the EVM. The zkEVM's popularity is driven entirely by the demand for Ethereum scaling solutions, specifically the ability to prove the validity of a rollup's state transition function. There are an abundance of zkEVMs, many of which are live or launching in the near future. It's worth noting that "zkEVM" is a slight misnomer, since in order to prove the Ethereum state transition function, you have to prove the entire Ethereum machine — not just EVM opcodes[^6] — such as loading the program and handling storage.

Other zkVMs such as Risc Zero or zkWASM target more traditional ISAs such as RISC-V and WASM, respectively. These ISAs have the advantage of a healthy ecosystem of tooling and R&D built around them.[^7] RISC-V is a register-based VM which, on average, demands lower memory requirements and executes faster than stack-based VMs such as the EVM.[^8] RISC-V is an open ISA with a mature open source community including significant contributions from major institutions,[^9] which is ideal for mitigating VM design risk. On the other hand, WASM is popular within the gaming and dApp developer communities and runs in the browser, lending itself well to client-side proving — an important feature for privacy. However, these traditional targets were not designed to be compatible with ZK-proof systems and typically trade off performance.

Alternatively, a zkVM can be purpose-built from the ground up, such as Starkware's CairoVM. These custom ISAs minimize the number and complexity of operations in their ISA and often necessitate a custom programming language (i.e., Cairo). Establishing developer tools and cultivating a community can be a challenge, though there are promising indicators of success exemplified by Starkware's ecosystem growth.[^10]

Across both custom and general zkVMs, one of the most popular applications is the EVM itself — as seen in Kakarot and zkSync's original implementation. Recently, Risc Zero introduced Zeth, which runs a Reth Ethereum client inside their zkVM.[^11] From the surface, Zeth is impressive as it stands as the only zkEVM to verify a complete existing Ethereum client. What amplifies this achievement is that Zeth was built in three months by three engineers. Current zkEVMs have taken many years and hundreds of engineers and researchers to develop. While there is a lot to be said about the performance viability of Zeth as a practical zkEVM client, the resource costs of development are astonishing and are a clear indication of technological progress. I expect this trend to continue at a rapid pace as more developers build ZK applications and share their libraries with open source communities.

The ISA taxonomy can obscure what actually decides the zkVM competition: developer tooling and ecosystem, not raw proving performance. ISA is the engine; most developers buy the car. MySQL dominated for years not because it was technically superior but because it was trusted and easy to reach for. Starkware's bet on Cairo as a language — not just a proof system — is coherent in exactly this light. The winner in zkVMs likely has the best SDK, the most active library ecosystem, and the most Stack Overflow answers, regardless of what runs underneath.

### A Note on ZKML

ZKML sits at an earlier point on this curve than the rest of this piece implies. The core friction is specific: ML inference runs on floating point arithmetic (float32, float16), and ZK systems prefer operations over prime fields. Bridging that gap requires quantization — approximating the model's weights and activations as integers — which introduces approximation error. For some applications that error is acceptable; for most it isn't. Proof generation times for even modestly-sized models remain impractical for real-time use cases. EZKL is the most mature tooling in the space today. The honest framing is that ZKML is approximately where zkEVMs were in 2019: technically possible in narrow cases, economically unclear in most. Unlike zkEVMs, which had Ethereum scaling as an unambiguous demand signal from day one, ZKML's paying use cases — model provenance, regulatory attestation, on-chain ML verification — are still being defined.

## Ease-of-Use: Performance of Proof Systems

### Overview of Proof Systems

Proof systems are onions of mathematical complexity. They are highly technical computational models that form the backbone of ZK applications, and as such they are important to understand. In this section, I give a high-level overview that hopefully gives you an intuition to reason about them. To the technically gifted readers, please be warned of the abstractions that follow.

Proof systems essentially ingest a computation and return a proof that attests to the correctness of that computation according to some rules. The proof can be verified in polylogarithmic time without any interaction between the prover and verifier. These constructions are colloquially referred to as SNARKs.

Arithmetization is often considered the frontend of a proof system.[^12] In layman's terms, arithmetization translates a program into a format in which we can run mathematical proofs over. In particular, zero-knowledge proofs make use of certain equivalence properties of polynomials where we can evaluate two polynomials at a specific point and have very strong guarantees about whether or not they are equal to each other.[^13] Arithmetization is precisely "the process of converting a program into a set of polynomial equations that polynomial commitments are then used to check."[^14] Efficient arithmetization is essentially half the battle of constructing a zero-knowledge proof — and we have yet to touch any cryptographic techniques.

The output of arithmetization is a constraint system and execution trace. In zkVMs, the constraint system is typically an algebraic representation (i.e., polynomials) of the VM. We can think of the constraint system as the source of truth for the execution of a program — if our program satisfies the constraint system, the proof will return valid. An execution trace is a historical account of every step a program instantiates when executed by a VM, stored as a table. The execution trace, often referred to as the "witness," is essentially the input to your circuit.

#### Setup

In order for the prover and verifier to communicate with each other, we need to establish parameters that facilitate communication between the two parties. In the setup phase, a proof system establishes public parameters for the prover and verifier by running an algorithm which takes the circuit and some random bits as inputs. The public parameters serve as a summarized representation of the circuit, allowing the verifier to operate in logarithmic time compared to the circuit size.

Setup methods play a critical role in the security of a proof system. There are three main approaches:

- **Trusted single-circuit setups** generate random bits (R) that are explicitly linked to a circuit. A new setup process is required for every circuit. The random bits must be kept secret from the prover, otherwise they can prove false statements. Accordingly, the machines used to generate R are typically destroyed.
- **Trusted universal setups** separate R from the circuit through a two-step process. Step one generates a global parameter based on random bits. Step two generates parameters for the prover and verifier based on the global parameter and circuit. Importantly, we only need to generate random bits once, as the global parameters can be reused for any circuit.
- **Transparent setups** use no secret data, so no trusted setup is necessary.

#### Construction

Commitment schemes are the language of SNARKs and serve as the foundation for many other cryptographic primitives (e.g., Merkle trees). A commitment scheme binds a prover to a statement without revealing the content of that statement to the verifier. Most modern SNARKs use polynomial commitment schemes (PCS) — the most popular variants include KZG,[^15] FRI, and IPA.[^16] PCS allows us to selectively "open" specific evaluations of a committed polynomial, proving that a polynomial passes through a certain point. Commitments of polynomials tend to be much smaller than the polynomial itself, offering potential cost savings. In blockchains, PCS are abundant — they're used in Proto-Danksharding and data availability sampling. However, a PCS alone is not enough to construct a SNARK.

An interactive oracle proof (IOP) is the medium through which a prover and verifier communicate. IOPs combine techniques from two well-known proof systems: interactive proofs and probabilistically-checkable proofs.[^17]

- **Interactive proofs (IPs)** model an exchange of interactions between a prover and a verifier where the prover convinces the verifier of the correctness of a statement. The prover provides some evidence — typically called a "witness" in SNARKs — and the verifier asks questions to check the correctness of the evidence without knowing the proof itself.
- **Probabilistically-checkable proofs (PCPs)** allow a verifier to efficiently check the correctness of a statement by only inspecting a small, random portion of the proof.

#### Recursion, Folding, and Aggregation

Recursion, folding, and aggregation are a class of proof system tools that combine two or more proofs into one. Today, almost all state-of-the-art proof systems employ one or more of these methods. We can think of these combination techniques as a final step added at the end of a proof system.

The most naive combination technique is aggregation, which combines many similar proofs into one. Aggregation is a one-shot process of compressing proofs, however it requires more forethought in the earlier stages of the proof system. Aggregation is particularly effective in amortizing proof verification costs because a single proof can attest to the correctness of many proofs. Typically aggregation is limited to combining proofs of the same proof type, however I believe there's growing demand for heterogeneous proof aggregation.

Proof recursion or folding is derived from a technique called Incrementally Verifiable Compute (IVC), introduced in 2008 as a general framework for producing a proof in an incremental manner. IVC works particularly well for structured computations that contain a pattern of repeating sub-computations (e.g., zkVM, zkBridge, VDF). Proving incremental computations essentially boils down to proving two things: 1) the verification of a proof of the last computation and, 2) the current computation.

Recursion and folding schemes have a lot of nuance and are an active area of research. We can bucket these techniques into three categories:

| Technique | Proof | Verifier | Implementations |
|---|---|---|---|
| "Full" recursion | Proof is a SNARK | Verifier fully verifies proof | Fractal, Plonky2 |
| Atomic Accumulation | Proof is a SNARK | Verifier partially verifies proof | Halo |
| Folding | Commitment to witness + extra information | Verifier combines commitments | Nova, Protostar |

In atomic accumulation, the verifier only partially checks the proof, pushing the expensive operations of verification to the very last step. In folding schemes, the insight is that you don't need to generate a full SNARK for every step of computation — rather, you can combine the commitments of the prior step with the current step without compromising the integrity of the final proof. This effectively pushes the expensive computations for proof generation and verification until the very last step.

And that's it! (Sort of). What's important to know here is that at any step of this process, a researcher or engineer may choose to swap out one method for another to improve their system for their specific purpose. This is why we have so many variants for SNARKs.

### The Future of Proof Systems

Now that we have a better understanding of proof systems, we can reason about where the space is headed. I believe performance improvements by virtue of hardware acceleration and proof system advancement could amount to 100–1000x efficiency gains.

#### Proof Acceleration

The computational demands of a proof system can be 10–1000x the original program depending on the implementation. Virtually all ZK applications stand to benefit from faster and cheaper provers and verifiers. Some of the brightest cryptographers, mathematicians, electrical engineers, and hardware specialists are pouring their resources into ZK acceleration efforts through algorithmic advancements (like folding) and hardware acceleration.

One low-hanging optimization is a theoretical 10x improvement from minimizing NTT and MSM operations, which make up a bulk of the computation used in polynomial IOPs and commitment schemes. This can be done by optimizing finite field operations and/or building custom hardware. A growing number of startups have set their sights on catalyzing ZK performance through hardware acceleration, including Cysic, Ingonyama, Ulvetanna, Supranational, and Fabric.

In parallel, there is an expanding body of literature on new, more efficient proof systems. I expect these trends to persist for the foreseeable future as the ecosystem of ZK applications grows, though I have already begun to see some forms of consolidation across application use cases on general proof system frameworks.[^18]

The risk that doesn't get discussed enough here: ZK hardware acceleration is an implicit bet on specific proof systems. ASICs are built around particular field arithmetic — BN254, Goldilocks, Mersenne31 — and those choices map directly onto specific proof systems. If ecosystem preferences shift, existing hardware gets stranded. Ingonyama and Ulvetanna are making proof system bets whether they say so publicly or not. Investors in this layer should understand they're two bets deep.

#### STARK Maturity

One of the most popular proof systems today is STARKs. Pioneered by Starkware, they have been the dominant proof system for ZK rollups. Because of the work to make STARKs practical, there has been a great deal of effort in maturing the ecosystem around them. Audits, theorem advancements, and multiple implementations have bolstered the robustness of STARK implementations. The maturity of STARKs has pushed many ZK application teams to adopt the proof system, which will likely encourage a reflexive dynamic for more contributors. This is a very promising development for a nascent technology and could stand as a defining feature for future ZK applications — especially as concerns about ZK bugs and circuit implementations grow alongside increasing security and auditing demands.

#### Potential for Folding

To quantify the gains: Nova requires 2 MSM operations[^19] whereas Plonk demands 22+ MSMs and FFTs.[^20] The tradeoff is that Nova's proof size is proportional to the size of the circuit, so Nova uses a final SNARK to compress the proof size. Nova in its original form is limited to computations with a fixed circuit structure (i.e., repetition of the same computation), which means each step may incur costs from unused operations. Newer works offer more efficient means of implementing folding schemes inspired by Nova, such as SuperNova[^21] and HyperNova.[^22] Other lines of folding work are also making meaningful headway, such as Protostar.[^23]

Because we now have techniques that can efficiently unlock economies of scale for proof generation (folding and recursion) and proof verification (aggregation), the design space for ZK applications explodes — the cost and latency overhead that made these applications feel prohibitive is decreasing with each passing research cycle. Given the expressivity and ease-of-use of zkVMs, as we approach near-negligible overheads, the design space for ZK applications grows exponentially.

#### Fragmentation, Not Convergence

A reasonable prediction here is persistent fragmentation rather than convergence on one or two dominant proof systems. The tradeoff space is multi-dimensional — verification cost, proof size, prover latency, circuit flexibility — and different deployment environments optimize along different axes. Ethereum L1 uses KZG for Proto-Danksharding because verification cost is the binding constraint. StarkNet uses STARKs because no trusted setup and recursive composition matter more than verification gas. Plonky2 and Boojum exist because zkSync needed EVM compatibility with proof aggregation. These aren't transitional choices — they reflect genuinely different requirements that don't collapse. The proof market thesis only works if that fragmentation persists, which I think it will.

## Costs of a ZKP

Now that we have a general understanding of proof systems, we can consider the total costs of a proof — what I'll refer to as proof delivery. Proof delivery can be split into two cost buckets: 1) proof generation, handled by the Prover, and 2) proof verification, handled by the Verifier, which in blockchain-based systems is typically a smart contract. A general rule of thumb is that proof generation and proof verification costs are inversely correlated — smaller proofs have lower verification costs but typically demand more rigorous computation to generate.

On a pure computational expenditure basis, proof generation costs significantly more than proof verification — a property that's obvious when we consider succinctness. Generally speaking, all proofs follow sublinear compression, which means verification time is sublinear to proof generation time and oftentimes logarithmic.[^24] However, in blockchain-based systems, verification is executed on-chain, making it the lion's share of dollar cost.

In the context of ZK rollups, we use (mostly) STARKs to prove the validity of a set of statements at once, packaged as a block. Every block has n transactions of some complexity and size. The critical insight here is that the total proof cost for a block is largely fixed regardless of how many transactions are packed into it — the prover generates one proof attesting to the validity of all state transitions in that block. This creates a powerful amortization dynamic: as blocks fill up, the per-transaction cost of a rollup approaches near-zero. This is why ZK rollups exhibit improving unit economics as they scale, a flywheel that doesn't exist in optimistic rollup architectures where dispute resolution costs grow with transaction complexity.

The real cost bottleneck today is on-chain verification — specifically, the gas cost of verifying a STARK or SNARK proof on Ethereum. Even with succinct proofs, L1 verification costs are non-trivial, though the economics are already favorable compared to direct L1 execution. Proto-Danksharding, and eventually full Danksharding, will continue to compress these costs by reducing calldata overhead. In parallel, proof systems like Plonky2 and Boojum are actively optimizing for EVM-friendly verification, reducing gas consumption with each iteration.

Looking at the fuller picture of proof delivery costs — generation, aggregation, and on-chain verification — I believe we are entering a period where the economic case for ZK applications becomes undeniable. The combination of hardware acceleration reducing prover costs, folding schemes slashing the number of operations required, and L1 improvements lowering verification costs creates a compressing cost structure that should reach near parity with centralized compute within the decade.

## Proof System Security and Auditing

One of the biggest threats to the adoption of ZK technologies is bugs. ZKPs, especially circuits, are complex pieces of software that very few people have the knowledge to develop. While zkVMs abstract away the need for developers to understand how ZKPs or circuits work, they inherit new vulnerabilities. Effectively, a zkVM takes a developer's code and runs it through a series of translators (compilers and interpreters) to produce a ZK-friendly representation of the program. Translating between languages isn't always a clean task, and every translator introduces new surface area for exploits.

A simple metaphor: think about translating between verbal languages such as Spanish and English. There are many Spanish words that don't have a direct translation to English and, even worse, have different literal meanings than their linguistic meaning (e.g., Botellón directly translates to "big bottle" but colloquially means "party in the street").

The specific attack surface worth naming: when a developer writes Rust and runs it through a zkVM toolchain, they're trusting the Rust compiler, the RISC-V translation layer, the arithmetization step, and the proof system itself. A bug at any of those layers can produce a valid-looking proof of an incorrect computation. This is qualitatively different from a smart contract bug, which at least produces incorrect on-chain state that observers might notice. A ZK circuit bug can be invisible indefinitely — the proof itself is the attestation of correctness. ZKSecurity.xyz has catalogued multiple production instances of underconstrained circuits: bugs where a prover can satisfy constraints using inputs that violate the intended semantics, with no visible signal until exploitation.

If we expect ZK circuits to secure billions to trillions of value, we must have more formal methods of ensuring their security. The ZCash example in this piece is instructive in a darker way than I've made it: that bug existed for two years before disclosure.[^25] Formal verification, broader audit culture, and dedicated ZK security firms are not a nice-to-have at scale — they are a prerequisite for institutional trust.

## Conclusion

We are at a genuine inflection point for applied cryptography. What began as an academic curiosity — can we prove something without revealing it? — has matured into a full-stack engineering discipline with battle-tested tooling, a growing developer community, and clear product-market fit across multiple use cases.

The most important transition underway isn't a single research breakthrough. It's the emergence of developer platforms that democratize ZK application development. zkVMs have collapsed the technical barrier to entry from a graduate-level cryptography background to: if you can write Rust, you can build a ZK application. That compression of developer prerequisites is historically significant. When a new paradigm meets a general-purpose abstraction layer — think of the relationship between TCP/IP and the browser, or AWS and modern SaaS — adoption doesn't increase linearly. It compounds.

Proof systems are maturing in lockstep. The performance improvements outlined in this piece — folding schemes, hardware acceleration, NTT and MSM optimizations — are not speculative. They are active lines of research and engineering with committed capital and some of the brightest technical minds in cryptography behind them. The 100–1000x overhead that makes today's ZK applications feel expensive is a temporary condition, not a structural one.

The blockchain industry deserves credit for stress-testing these systems at scale and funding the research that made this ecosystem possible. But ZKPs are not a blockchain-native technology — they are infrastructure for any computation where trust, privacy, or verification matters. Verifiable ML inference, privacy-preserving identity, trustless cross-chain state: these applications likely represent a fraction of what gets built as proof overhead approaches zero. Whether that demand materializes on the timeline the industry hopes for is the open question this piece can't answer.

That expanding design space is what I'm most excited about. ZKPs are exiting their R&D phase in real time, and the tools to build with them have never been more accessible. The question is no longer whether verifiable computation will matter — it's which applications will define the next decade.

[^1]: Technology Acceptance Model (TAM) — Davis, 1989.
[^2]: ZCash launched in 2016, drawing on SNARK research dating to 2012.
[^3]: On a relative basis, ZK research is implemented quicker than typical bodies of mathematical theory research.
[^4]: Arkworks covers the challenge of ZK application development in this lecture (May 2021): https://www.youtube.com/watch?v=_Zcz4Y4yt1Q
[^5]: Not all VMs are stateful.
[^6]: Scroll's CEO on what zkEVM really means: https://twitter.com/yezhang1998/status/1522422917304561664
[^7]: Over 10 billion RISC-V cores in market — RISC-V 2022 End of Year Review.
[^8]: Performance Survey on Stack-based and Register-based Virtual Machines: https://arxiv.org/pdf/1611.00467.pdf
[^9]: https://riscv.org/about/history/
[^10]: https://www.developerreport.com/ecosystems/starknet
[^11]: Reth client in Risc Zero's zkVM: https://twitter.com/gakonst/status/1682396472115884034
[^12]: a16z's Justin Thaler: https://a16zcrypto.com/posts/article/measuring-snark-performance-frontends-backends-and-the-future/
[^13]: Schwartz-Zippel Lemma: https://brilliant.org/wiki/schwartz-zippel-lemma/
[^14]: https://vitalik.ca/general/2019/09/22/plonk.html
[^15]: KZG: https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf
[^16]: IPA: https://eprint.iacr.org/2017/1066.pdf
[^17]: IOPs: https://eprint.iacr.org/2016/116
[^18]: zkSync's Boojum shares a similar architecture to other STARK-based proof systems in rollups.
[^19]: Operations are proportionate to the circuit size.
[^20]: Noted by Srinath, author of Nova, in zkStudy club: https://www.youtube.com/watch?v=ilrvqajkrYY
[^21]: SuperNova: https://eprint.iacr.org/2022/1758
[^22]: HyperNova: https://eprint.iacr.org/2023/573
[^23]: Protostar: https://eprint.iacr.org/2023/620.pdf
[^24]: In some instances, if the circuit is very small, the prover time could be smaller than the verifier time.
[^25]: ZCash circuit bug in 2019: https://www.coindesk.com/markets/2019/02/05/zcash-team-reveals-it-fixed-a-catastrophic-coin-counterfeiting-bug/
