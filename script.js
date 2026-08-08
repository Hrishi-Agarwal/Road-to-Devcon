const STORAGE = "decentraSignalState";

const defaultProposals = [
  {
    id: "P-7A2F",
    title: "Should our community fund open-source infrastructure?",
    description:
      "Allocate community resources toward public developer infrastructure and open-source tooling.",
    creator: "0x91A...7C2D",
    status: "active",
    participants: 184,
    deadline: "Aug 12, 2026",
    mechanism: "Commit-Reveal",
    consensus: null,
    options: ["YES", "NO", "ABSTAIN"]
  },
  {
    id: "P-4C19",
    title: "Which public-good project should receive funding?",
    description:
      "Signal which category should receive the next community public-goods grant.",
    creator: "0x3B8...A91E",
    status: "completed",
    participants: 426,
    deadline: "Aug 04, 2026",
    mechanism: "Quadratic Signal",
    consensus: 78,
    options: ["Education", "Climate", "Infrastructure", "Research"]
  },
  {
    id: "P-91DE",
    title: "Should the community adopt a new governance rule?",
    description:
      "A proposed governance change designed to make coordination more transparent.",
    creator: "0x7F2...C812",
    status: "upcoming",
    participants: 0,
    deadline: "Aug 18, 2026",
    mechanism: "Equal Signal",
    consensus: null,
    options: ["YES", "NO"]
  },
  {
    id: "P-22BA",
    title: "Adopt a shared open-source contributor fund?",
    description:
      "Create a transparent pool to support contributors maintaining public goods.",
    creator: "0x5D0...18F1",
    status: "active",
    participants: 267,
    deadline: "Aug 15, 2026",
    mechanism: "Commit-Reveal",
    consensus: null,
    options: ["YES", "NO", "ABSTAIN"]
  },
  {
    id: "P-6E4B",
    title: "Community research priorities for Q4",
    description:
      "Signal the research direction that should receive community attention.",
    creator: "0x2E1...4FA0",
    status: "completed",
    participants: 318,
    deadline: "Jul 29, 2026",
    mechanism: "Equal Signal",
    consensus: 71,
    options: ["AI", "Climate", "Privacy", "Infrastructure"]
  },
  {
    id: "P-88CC",
    title: "Create a decentralized local events fund?",
    description:
      "Should the community allocate funds to permissionless local meetups and workshops?",
    creator: "0xAA1...C201",
    status: "active",
    participants: 89,
    deadline: "Aug 20, 2026",
    mechanism: "Quadratic Signal",
    consensus: null,
    options: ["YES", "NO", "ABSTAIN"]
  }
];

let state = loadState();


// ==========================================
// STORAGE
// ==========================================

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE));

    if (saved) {
      return {
        ...saved,
        proposals:
          saved.proposals && saved.proposals.length
            ? saved.proposals
            : structuredClone(defaultProposals)
      };
    }
  } catch (error) {
    console.error("Could not load saved state:", error);
  }

  return {
    wallet: null,
    proposals: structuredClone(defaultProposals),

    commitments: {},

    activity: [
      {
        text: "Vote committed",
        time: "2 minutes ago"
      },
      {
        text: "Vote revealed",
        time: "5 minutes ago"
      },
      {
        text: "Proposal created",
        time: "12 minutes ago"
      },
      {
        text: "Consensus finalized",
        time: "1 hour ago"
      }
    ],

    stats: {
      created: 3,
      submitted: 8,
      revealed: 7
    }
  };
}


function save() {
  localStorage.setItem(STORAGE, JSON.stringify(state));
}


// ==========================================
// UTILITIES
// ==========================================

function esc(value) {
  return String(value).replace(/[&<>"']/g, function (char) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return map[char];
  });
}


function toast(message, success = true) {
  const container = document.getElementById("toastContainer");

  const toastElement = document.createElement("div");

  toastElement.className =
    "toast" + (success ? " success" : "");

  toastElement.textContent = message;

  container.appendChild(toastElement);

  setTimeout(() => {
    toastElement.remove();
  }, 3000);
}


// ==========================================
// PROPOSALS
// ==========================================

function renderProposals(filter = "all") {
  const grid = document.getElementById("proposalGrid");

  if (!grid) return;

  const proposals = state.proposals.filter((proposal) => {
    return filter === "all" || proposal.status === filter;
  });

  grid.innerHTML = proposals
    .map((proposal) => {
      return `
        <article class="proposal-card glass">

          <span class="status ${proposal.status}">
            ${proposal.status}
          </span>

          <h3>
            ${esc(proposal.title)}
          </h3>

          <p>
            ${esc(proposal.description)}
          </p>

          <div class="proposal-meta">

            <div>
              CREATOR
              <strong>
                ${esc(proposal.creator)}
              </strong>
            </div>

            <div>
              PARTICIPANTS
              <strong>
                ${proposal.participants.toLocaleString()}
              </strong>
            </div>

            <div>
              DEADLINE
              <strong>
                ${esc(proposal.deadline)}
              </strong>
            </div>

            <div>
              MECHANISM
              <strong>
                ${esc(proposal.mechanism)}
              </strong>
            </div>

          </div>

          ${
            proposal.consensus !== null
              ? `
                <div class="consensus-mini">
                  Consensus
                  <strong>
                    ${proposal.consensus}%
                  </strong>
                </div>
              `
              : ""
          }

          <button
            class="proposal-open"
            onclick="openProposal('${proposal.id}')"
          >
            ${
              proposal.status === "completed"
                ? "View Results"
                : "Participate"
            }
            →
          </button>

        </article>
      `;
    })
    .join("");
}


// ==========================================
// MODALS
// ==========================================

function openModal(html) {
  document.getElementById("modalContent").innerHTML = html;

  document
    .getElementById("modalBackdrop")
    .classList.remove("hidden");
}


function closeModal() {
  document
    .getElementById("modalBackdrop")
    .classList.add("hidden");
}


// ==========================================
// WALLET
// ==========================================

function connectWallet() {
  openModal(`
    <div class="modal-head">

      <h2>Connect Wallet</h2>

      <button
        class="close"
        onclick="closeModal()"
      >
        ×
      </button>

    </div>

    <p style="color:var(--muted)">
      Choose a simulated identity for this frontend prototype.
    </p>

    <div class="form-grid">

      <button
        class="btn btn-secondary"
        onclick="demoConnect('MetaMask')"
      >
        🦊 MetaMask
        <small>simulation</small>
      </button>

      <button
        class="btn btn-secondary"
        onclick="demoConnect('WalletConnect')"
      >
        ◈ WalletConnect
        <small>simulation</small>
      </button>

      <button
        class="btn btn-primary"
        onclick="demoConnect('Demo Wallet')"
      >
        ◉ Demo Wallet
      </button>

    </div>

    <p
      class="prototype-note"
      style="margin-top:20px"
    >
      No real wallet or blockchain connection is made.
    </p>
  `);
}


function demoConnect(provider) {
  state.wallet = "0x7A3...91F2";

  save();

  closeModal();

  updateWallet();

  toast(`${provider}: Demo Wallet connected ✓`);

  addActivity("Demo wallet connected");
}


function disconnect() {
  state.wallet = null;

  save();

  updateWallet();

  closeModal();

  toast("Demo wallet disconnected");
}


function updateWallet() {
  const walletButton = document.getElementById("walletBtn");

  if (!walletButton) return;

  walletButton.textContent =
    state.wallet || "Connect Wallet";

  walletButton.onclick = state.wallet
    ? walletMenu
    : connectWallet;

  const profileWallet =
    document.getElementById("profileWallet");

  if (profileWallet) {
    profileWallet.textContent =
      state.wallet || "Demo participant";
  }
}


function walletMenu() {
  openModal(`
    <div class="modal-head">

      <h2>Demo Wallet</h2>

      <button
        class="close"
        onclick="closeModal()"
      >
        ×
      </button>

    </div>

    <p
      style="
        font:12px DM Mono;
        color:var(--green)
      "
    >
      Wallet Connected
    </p>

    <div class="code-pill">
      ${state.wallet}
    </div>

    <div class="form-grid">

      <button
        class="btn btn-secondary"
        onclick="
          closeModal();
          document
            .getElementById('simulator')
            .scrollIntoView();
        "
      >
        My Profile
      </button>

      <button
        class="btn btn-secondary"
        onclick="
          closeModal();
          document
            .getElementById('commit')
            .scrollIntoView();
        "
      >
        My Votes
      </button>

      <button
        class="btn btn-secondary"
        onclick="disconnect()"
      >
        Disconnect
      </button>

    </div>
  `);
}


// ==========================================
// CREATE PROPOSAL
// ==========================================

function createProposalModal() {
  openModal(`
    <div class="modal-head">

      <h2>Create Proposal</h2>

      <button
        class="close"
        onclick="closeModal()"
      >
        ×
      </button>

    </div>

    <div class="form-grid">

      <label>
        Proposal Title

        <input
          id="pTitle"
          maxlength="100"
          placeholder="What should the community decide?"
        >
      </label>

      <label>
        Description

        <textarea
          id="pDesc"
          maxlength="300"
          placeholder="Explain the proposal..."
        ></textarea>
      </label>

      <label>
        Options

        <div id="optionList">

          <div class="option-row">
            <input value="YES">

            <button
              class="remove-option"
              onclick="removeOption(this)"
            >
              ×
            </button>
          </div>

          <div class="option-row">
            <input value="NO">

            <button
              class="remove-option"
              onclick="removeOption(this)"
            >
              ×
            </button>
          </div>

        </div>

      </label>

      <button
        class="add-option"
        onclick="addOption()"
      >
        + Add option
      </button>

      <label>
        Voting Mechanism

        <select id="pMechanism">

          <option>
            Equal Signal
          </option>

          <option>
            Quadratic Signal
          </option>

          <option>
            Commit-Reveal
          </option>

        </select>
      </label>

      <label>
        Commit Duration

        <select id="pCommit">

          <option>24 hours</option>
          <option>48 hours</option>
          <option>72 hours</option>

        </select>
      </label>

      <label>
        Reveal Duration

        <select id="pReveal">

          <option>24 hours</option>
          <option>48 hours</option>
          <option>72 hours</option>

        </select>
      </label>

    </div>

    <div class="modal-actions">

      <button
        class="btn btn-secondary"
        onclick="closeModal()"
      >
        Cancel
      </button>

      <button
        class="btn btn-primary"
        onclick="createProposal()"
      >
        Create Proposal
      </button>

    </div>
  `);
}


function addOption() {
  const list = document.getElementById("optionList");

  const row = document.createElement("div");

  row.className = "option-row";

  row.innerHTML = `
    <input placeholder="New option">

    <button
      class="remove-option"
      onclick="removeOption(this)"
    >
      ×
    </button>
  `;

  list.appendChild(row);
}


function removeOption(button) {
  const rows =
    document.querySelectorAll(
      "#optionList .option-row"
    );

  if (rows.length > 2) {
    button.parentElement.remove();
  } else {
    toast(
      "A proposal needs at least two options.",
      false
    );
  }
}


function createProposal() {
  const title =
    document.getElementById("pTitle").value.trim();

  const description =
    document.getElementById("pDesc").value.trim();

  const options =
    [...document.querySelectorAll("#optionList input")]
      .map((input) => input.value.trim())
      .filter(Boolean);

  if (
    !title ||
    !description ||
    options.length < 2
  ) {
    toast(
      "Please complete the proposal fields.",
      false
    );

    return;
  }

  const id =
    "P-" +
    Math.random()
      .toString(16)
      .slice(2, 6)
      .toUpperCase();

  const proposal = {
    id,

    title,

    description,

    creator:
      state.wallet ||
      "0x7A3...91F2",

    status: "active",

    participants: 0,

    deadline: "Aug 24, 2026",

    mechanism:
      document.getElementById("pMechanism").value,

    consensus: null,

    options
  };

  closeModal();

  showTransaction(
    "Create Proposal",
    () => {

      state.proposals.unshift(proposal);

      state.stats.created++;

      addActivity("Proposal created");

      save();

      renderProposals();

      document
        .getElementById("proposals")
        .scrollIntoView();
    }
  );
}


// ==========================================
// TRANSACTION SIMULATION
// ==========================================

function showTransaction(action, onDone) {
  openModal(`
    <div class="modal-head">

      <h2>
        Confirm Transaction
      </h2>

    </div>

    <p style="color:var(--muted)">
      This is a frontend transaction simulation.
    </p>

    <div class="detail-meta">

      <div>
        Action
        <strong>
          ${esc(action)}
        </strong>
      </div>

      <div>
        Network
        <strong>
          Ethereum Testnet (demo)
        </strong>
      </div>

      <div>
        Estimated Gas
        <strong>
          0.002 ETH
        </strong>
      </div>

      <div>
        Wallet
        <strong>
          ${state.wallet || "Demo Wallet"}
        </strong>
      </div>

    </div>

    <div class="modal-actions">

      <button
        class="btn btn-secondary"
        onclick="closeModal()"
      >
        Cancel
      </button>

      <button
        class="btn btn-primary"
        id="confirmTx"
      >
        Confirm
      </button>

    </div>
  `);

  document.getElementById("confirmTx").onclick =
    () => {

      document.getElementById("modalContent").innerHTML = `
        <div class="modal-head">
          <h2>
            Transaction submitted
          </h2>
        </div>

        <div class="tx-steps">

          <div class="tx-step done">
            Preparing transaction...
          </div>

          <div class="tx-step done">
            Waiting for wallet confirmation...
          </div>

          <div class="tx-step done">
            Transaction submitted...
          </div>

          <div
            class="tx-step"
            id="blockStep"
          >
            Waiting for block confirmation...
          </div>

        </div>
      `;

      setTimeout(() => {

        const blockStep =
          document.getElementById("blockStep");

        blockStep.classList.add("done");

        blockStep.textContent =
          "Block confirmed ✓";

        setTimeout(() => {

          closeModal();

          if (onDone) {
            onDone();
          }

          toast(
            "Transaction confirmed ✓"
          );

        }, 700);

      }, 1000);
    };
}


// ==========================================
// PROPOSAL DETAILS
// ==========================================

function openProposal(id) {
  const proposal =
    state.proposals.find(
      (item) => item.id === id
    );

  if (!proposal) return;

  openModal(`
    <div class="modal-head">

      <h2>
        ${esc(proposal.title)}
      </h2>

      <button
        class="close"
        onclick="closeModal()"
      >
        ×
      </button>

    </div>

    <span
      class="status ${proposal.status}"
    >
      ${proposal.status}
    </span>

    <p style="color:var(--muted)">
      ${esc(proposal.description)}
    </p>

    <div class="detail-meta">

      <div>
        Creator
        <strong>
          ${esc(proposal.creator)}
        </strong>
      </div>

      <div>
        Status
        <strong>
          ${proposal.status}
        </strong>
      </div>

      <div>
        Deadline
        <strong>
          ${esc(proposal.deadline)}
        </strong>
      </div>

      <div>
        Mechanism
        <strong>
          ${esc(proposal.mechanism)}
        </strong>
      </div>

      <div>
        Participants
        <strong>
          ${proposal.participants}
        </strong>
      </div>

      <div>
        Consensus
        <strong>
          ${
            proposal.consensus === null
              ? "Pending"
              : proposal.consensus + "%"
          }
        </strong>
      </div>

    </div>

    ${
      proposal.status === "completed"

        ? `
          <div
            class="consensus-mini"
            style="margin-top:20px"
          >
            Final consensus
            <strong>
              ${proposal.consensus}%
            </strong>
          </div>
        `

        : `

          <h3 style="margin-top:25px">
            Choose your signal
          </h3>

          <div class="detail-options">

            ${proposal.options
              .map(
                (option, index) => `
                  <button
                    class="vote-option"
                    onclick="
                      selectVote(
                        '${proposal.id}',
                        ${index}
                      )
                    "
                  >

                    <strong>
                      ${esc(option)}
                    </strong>

                    <small
                      style="
                        display:block;
                        color:var(--muted);
                        margin-top:5px
                      "
                    >
                      ${
                        proposal.mechanism ===
                        "Commit-Reveal"

                          ? "Commit privately"

                          : "Signal your preference"
                      }
                    </small>

                  </button>
                `
              )
              .join("")}

          </div>

          <p class="prototype-note">
            Demo only. Your action is stored locally
            in this browser.
          </p>
        `
    }
  `);
}


// ==========================================
// VOTING
// ==========================================

async function selectVote(id, index) {
  const proposal =
    state.proposals.find(
      (item) => item.id === id
    );

  if (!proposal) return;

  const vote =
    proposal.options[index];

  if (
    proposal.mechanism ===
    "Commit-Reveal"
  ) {
    await commitVote(id, vote);
  } else {

    showTransaction(
      "Submit Signal",
      () => {

        proposal.participants++;

        state.stats.submitted++;

        addActivity(
          `Signal submitted: ${vote}`
        );

        save();

        closeModal();

        renderProposals();

        toast(
          "Signal submitted ✓"
        );
      }
    );
  }
}


// ==========================================
// COMMIT-REVEAL
// ==========================================

async function commitVote(id, vote) {

  const randomBytes =
    crypto.getRandomValues(
      new Uint8Array(16)
    );

  const secret =
    [...randomBytes]
      .map(
        (byte) =>
          byte
            .toString(16)
            .padStart(2, "0")
      )
      .join("");

  const hash =
    await sha256(
      `${vote}:${secret}`
    );

  state.commitments[id] = {
    vote,
    secret,
    hash,
    revealed: false
  };

  save();

  showTransaction(
    "Commit Vote",
    () => {

      addActivity(
        "Vote committed"
      );

      save();

      openReveal(id);
    }
  );
}


function openReveal(id) {
  const commitment =
    state.commitments[id];

  if (!commitment) return;

  openModal(`
    <div class="modal-head">

      <h2>
        Vote committed ✓
      </h2>

      <button
        class="close"
        onclick="closeModal()"
      >
        ×
      </button>

    </div>

    <p style="color:var(--muted)">
      Your vote is hidden.
      The commitment stored locally is:
    </p>

    <div class="hash-box">
      ${commitment.hash}
    </div>

    <div class="modal-actions">

      <button
        class="btn btn-secondary"
        onclick="closeModal()"
      >
        Reveal later
      </button>

      <button
        class="btn btn-primary"
        onclick="revealVote('${id}')"
      >
        Reveal Vote
      </button>

    </div>
  `);
}


async function revealVote(id) {

  const commitment =
    state.commitments[id];

  if (!commitment) return;

  const recalculated =
    await sha256(
      `${commitment.vote}:${commitment.secret}`
    );

  const match =
    recalculated === commitment.hash;

  commitment.revealed = match;

  if (match) {
    state.stats.revealed++;
  }

  addActivity("Vote revealed");

  save();

  openModal(`
    <div class="modal-head">

      <h2>
        ${
          match
            ? "Vote verified ✓"
            : "Verification failed"
        }
      </h2>

      <button
        class="close"
        onclick="closeModal()"
      >
        ×
      </button>

    </div>

    <p style="color:var(--muted)">
      Recalculated SHA-256 commitment:
    </p>

    <div class="hash-box">
      ${recalculated}
    </div>

    <p
      style="
        color:
        ${
          match
            ? "var(--green)"
            : "var(--red)"
        }
      "
    >
      ${
        match
          ? "The revealed vote and secret match your original commitment."
          : "The reveal does not match the stored commitment."
      }
    </p>

    <div class="code-pill">
      Vote:
      ${esc(commitment.vote)}
      · Secret:
      ${esc(commitment.secret)}
    </div>
  `);
}


async function sha256(text) {

  const data =
    new TextEncoder().encode(text);

  const hash =
    await crypto.subtle.digest(
      "SHA-256",
      data
    );

  return [
    ...new Uint8Array(hash)
  ]
    .map(
      (byte) =>
        byte
          .toString(16)
          .padStart(2, "0")
    )
    .join("");
}


// ==========================================
// ACTIVITY
// ==========================================

function addActivity(text) {

  state.activity.unshift({
    text,
    time: "just now"
  });

  state.activity =
    state.activity.slice(0, 6);

  renderActivity();
}


function renderActivity() {

  const feed =
    document.getElementById(
      "activityFeed"
    );

  if (feed) {

    feed.innerHTML =
      state.activity
        .map(
          (activity) => `
            <div class="feed-item">

              <span class="feed-icon">
                ✓
              </span>

              <div>

                <strong>
                  ${esc(activity.text)}
                </strong>

                <small>
                  ${esc(activity.time)}
                </small>

              </div>

            </div>
          `
        )
        .join("");
  }

  const created =
    document.getElementById(
      "createdCount"
    );

  const submitted =
    document.getElementById(
      "submittedCount"
    );

  const revealed =
    document.getElementById(
      "revealedCount"
    );

  const rate =
    document.getElementById(
      "rateCount"
    );

  if (created) {
    created.textContent =
      state.stats.created;
  }

  if (submitted) {
    submitted.textContent =
      state.stats.submitted;
  }

  if (revealed) {
    revealed.textContent =
      state.stats.revealed;
  }

  if (rate) {

    const percentage =
      Math.round(
        (state.stats.revealed /
          Math.max(
            1,
            state.stats.submitted
          )) *
          100
      );

    rate.textContent =
      percentage + "%";
  }
}


// ==========================================
// QUADRATIC SIGNALING
// ==========================================

function updateQuadratic() {

  const slider =
    document.getElementById(
      "signalSlider"
    );

  if (!slider) return;

  const value =
    Number(slider.value);

  const cost =
    value * value;

  document.getElementById(
    "signalOutput"
  ).textContent = value;

  document.getElementById(
    "signalCost"
  ).textContent = cost;

  document.getElementById(
    "barSignal"
  ).textContent = value;

  document.getElementById(
    "barCost"
  ).textContent = cost;

  document.getElementById(
    "signalBar"
  ).style.width =
    value * 10 + "%";

  document.getElementById(
    "costBar"
  ).style.width =
    cost + "%";
}


// ==========================================
// COLLUSION SIMULATOR
// ==========================================

function updateSimulator() {

  const normalSlider =
    document.getElementById(
      "normalSlider"
    );

  const walletSlider =
    document.getElementById(
      "walletSlider"
    );

  const whaleSlider =
    document.getElementById(
      "whaleSlider"
    );

  if (
    !normalSlider ||
    !walletSlider ||
    !whaleSlider
  ) {
    return;
  }

  const normal =
    Number(normalSlider.value);

  const wallets =
    Number(walletSlider.value);

  const strength =
    Number(whaleSlider.value);

  document.getElementById(
    "normalOut"
  ).textContent = normal;

  document.getElementById(
    "walletOut"
  ).textContent = wallets;

  document.getElementById(
    "whaleOut"
  ).textContent = strength;

  const traditional =
    Math.min(
      99,
      (wallets * strength) /
        (normal + wallets) *
        100
    );

  const model =
    Math.min(
      99,
      traditional *
        (
          0.35 +
          0.65 *
            (1 - strength / 120)
        )
    );

  document.getElementById(
    "traditionalInfluence"
  ).textContent =
    traditional.toFixed(1) + "%";

  document.getElementById(
    "modelInfluence"
  ).textContent =
    model.toFixed(1) + "%";

  document.getElementById(
    "traditionalBar"
  ).style.width =
    traditional + "%";

  document.getElementById(
    "modelBar"
  ).style.width =
    model + "%";
}


// ==========================================
// COUNTERS
// ==========================================

function animateCounters() {

  document
    .querySelectorAll(
      "[data-counter]"
    )
    .forEach((element) => {

      const target =
        Number(
          element.dataset.counter
        );

      const suffix =
        element.dataset.suffix || "";

      let current = 0;

      const step =
        Math.max(
          1,
          target / 35
        );

      function tick() {

        current =
          Math.min(
            target,
            current + step
          );

        element.textContent =
          Math.round(
            current
          ).toLocaleString() +
          suffix;

        if (
          current < target
        ) {
          requestAnimationFrame(
            tick
          );
        }
      }

      tick();
    });
}


// ==========================================
// RESET
// ==========================================

function resetDemo() {

  localStorage.removeItem(
    STORAGE
  );

  state = loadState();

  renderProposals();

  renderActivity();

  updateWallet();

  toast(
    "Demo reset to sample data"
  );
}


// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderProposals();

    renderActivity();

    updateWallet();

    updateQuadratic();

    updateSimulator();

    animateCounters();


    // Proposal filters
    document
      .querySelectorAll(".filter")
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".filter"
              )
              .forEach((item) =>
                item.classList.remove(
                  "active"
                )
              );

            button.classList.add(
              "active"
            );

            renderProposals(
              button.dataset.filter
            );
          }
        );
      });


    // Create proposal buttons
    const createButton =
      document.getElementById(
        "createBtn"
      );

    const createHeroButton =
      document.getElementById(
        "createHeroBtn"
      );

    if (createButton) {
      createButton.onclick =
        createProposalModal;
    }

    if (createHeroButton) {
      createHeroButton.onclick =
        createProposalModal;
    }


    // Commit demo
    const commitDemoButton =
      document.getElementById(
        "commitDemoBtn"
      );

    if (commitDemoButton) {

      commitDemoButton.onclick =
        async () => {

          const vote =
            document.getElementById(
              "demoVote"
            ).value;

          const randomBytes =
            crypto.getRandomValues(
              new Uint8Array(12)
            );

          const secret =
            [...randomBytes]
              .map(
                (byte) =>
                  byte
                    .toString(16)
                    .padStart(2, "0")
              )
              .join("");

          const hash =
            await sha256(
              `${vote}:${secret}`
            );

          const result =
            document.getElementById(
              "commitResult"
            );

          result.classList.remove(
            "hidden"
          );

          result.innerHTML = `
            <strong>
              Vote committed ✓
            </strong>

            <br><br>

            SHA-256 commitment:

            <br>

            ${hash}

            <br><br>

            <span
              style="color:#77839e"
            >
              Secret stored for this
              demonstration:

              ${secret}
            </span>
          `;
        };
    }


    // Quadratic slider
    const signalSlider =
      document.getElementById(
        "signalSlider"
      );

    if (signalSlider) {
      signalSlider.addEventListener(
        "input",
        updateQuadratic
      );
    }


    // Simulator sliders
    const normalSlider =
      document.getElementById(
        "normalSlider"
      );

    const walletSlider =
      document.getElementById(
        "walletSlider"
      );

    const whaleSlider =
      document.getElementById(
        "whaleSlider"
      );

    if (normalSlider) {
      normalSlider.addEventListener(
        "input",
        updateSimulator
      );
    }

    if (walletSlider) {
      walletSlider.addEventListener(
        "input",
        updateSimulator
      );
    }

    if (whaleSlider) {
      whaleSlider.addEventListener(
        "input",
        updateSimulator
      );
    }


    // Reset demo
    const resetButton =
      document.getElementById(
        "resetBtn"
      );

    if (resetButton) {

      resetButton.onclick = () => {

        if (
          confirm(
            "Reset the demo and remove local activity?"
          )
        ) {
          resetDemo();
        }
      };
    }


    // Mobile navigation
    const mobileMenu =
      document.getElementById(
        "mobileMenu"
      );

    if (mobileMenu) {

      mobileMenu.onclick = () => {

        document
          .getElementById(
            "mainNav"
          )
          .classList.toggle(
            "open"
          );
      };
    }


    // Scroll buttons
    document
      .querySelectorAll(
        "[data-scroll]"
      )
      .forEach((button) => {

        button.onclick = () => {

          const target =
            document.querySelector(
              button.dataset.scroll
            );

          if (target) {
            target.scrollIntoView();
          }
        };
      });


    // Close modal when clicking backdrop
    const backdrop =
      document.getElementById(
        "modalBackdrop"
      );

    if (backdrop) {

      backdrop.addEventListener(
        "click",
        (event) => {

          if (
            event.target.id ===
            "modalBackdrop"
          ) {
            closeModal();
          }
        }
      );
    }

  }
);
