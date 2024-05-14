import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [splitBillForm, setSplitBillForm] = useState(0);

  function handleFriends(friend) {
    setFriends((friends) => [...friends, friend]);
  }

  function handleShowAddFriend() {
    setShowAddFriend((currState) => !currState);
  }

  function handleSplitBillForm(id) {
    if (id === splitBillForm) {
      setSplitBillForm(0);
    } else {
      setSplitBillForm(id);
    }
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onHandleSplitBillForm={handleSplitBillForm}
        />
        {showAddFriend && <FormAddFriend onHandleFriends={handleFriends} />}
        <button className="button" onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </button>
      </div>
      {friends.map((friend) =>
        friend.id === splitBillForm ? (
          <FormSplitBill
            friend={friend}
            friends={friends}
            setFriends={setFriends}
            setSplitBillForm={setSplitBillForm}
          />
        ) : (
          <></>
        )
      )}
    </div>
  );
}

function FriendsList({ friends, onHandleSplitBillForm }) {
  return (
    <ul>
      {friends.map((f) => (
        <Friend
          friend={f}
          key={f.id}
          onHandleSplitBillForm={onHandleSplitBillForm}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onHandleSplitBillForm }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <button
        className="button"
        onClick={() => onHandleSplitBillForm(friend.id)}
      >
        Select
      </button>
    </li>
  );
}

function FormAddFriend({ onHandleFriends }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) {
      return;
    }
    const id = crypto.randomUUID();
    const newFriend = {
      id: id,
      name: name,
      image: `${image}=?${id}`,
      balance: 0,
    };
    onHandleFriends(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48?u=48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👥 Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🌉 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <button className="button" onClick={handleSubmit}>
        Add
      </button>
    </form>
  );
}

function FormSplitBill({ friend, friends, setFriends, setSplitBillForm }) {
  const [bill, setBill] = useState(0);
  const [yourPay, setYourPay] = useState(0);
  const [payer, setPayer] = useState("user");

  function handleBalance(e) {
    e.preventDefault();

    let newBalance;
    if (payer === "user") {
      newBalance = friend.balance + (bill - yourPay);
    } else {
      newBalance = friend.balance - yourPay;
    }
    let newFriends = friends
      .slice()
      .map((f) => (f.id === friend.id ? { ...f, balance: newBalance } : f));
    setFriends(newFriends);
    setSplitBillForm(0);
  }

  return (
    <form className="form-split-bill" onSubmit={(e) => handleBalance(e)}>
      <h2>SPLIT A BILL WITH {friend.name}</h2>
      <label>💰 Bill</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />

      <label>🧍‍♀️ Your Expense</label>
      <input
        type="text"
        value={yourPay}
        onChange={(e) => setYourPay(e.target.value)}
      />

      <label>🧍 {friend.name}'s Expense</label>
      <input type="text" disabled value={bill - yourPay} />

      <label> 🤑 Who is paying the bill?</label>
      <select>
        <option value="user" onChange={(e) => setPayer(e.target.value)}>
          {" "}
          You
        </option>
        <option value="friend" onChange={(e) => setPayer(e.target.value)}>
          {" "}
          {friend.name}
        </option>
      </select>

      <button className="button" onClick={(e) => handleBalance(e)}>
        Split bill
      </button>
    </form>
  );
}
