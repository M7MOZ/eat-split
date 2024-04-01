import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
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
function App() {
  const [isAddFriendOpen, setisAddFriendOpen] = useState(false);
  const handleButtonClick = () => setisAddFriendOpen(!isAddFriendOpen);
  const [friendList, setFriendList] = useState(initialFriends);
  const [isSplitBillOpen, setisSplitBillOpen] = useState(false);
  const handleAddFriend = (name, image) => {
    const id = crypto.randomUUID();
    setFriendList([
      ...friendList,
      {
        id,
        name,
        image: `${image}?=${id}`,
        balance : 0,
      },
    ]);
    setisAddFriendOpen(false);
  };
  const hanleDeleteFriend = (id) => {
    setFriendList(friendList.filter((friendList) => friendList.id !== id));
  };
  const [selectedFriend, setSelectedFriend] = useState(null);
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friendList}
          deleteFriend={hanleDeleteFriend}
          onSelect={setSelectedFriend}
          onSplit={setisSplitBillOpen}
        ></FriendList>
        {isAddFriendOpen && (
          <FormAddFriend addFriend={handleAddFriend}></FormAddFriend>
        )}
        <Button closeAddFriend={handleButtonClick} className="button">
          {isAddFriendOpen ? "Close" : "Add friend"}
        </Button>
      </div>
      {isSplitBillOpen && (
        <FormSplitBill
          friend={selectedFriend}
          onSplit = {setisSplitBillOpen}
        ></FormSplitBill>
      )}
    </div>
  );
}

function FriendList({ friends, deleteFriend, onSelect, onSplit }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          deleteFriend={deleteFriend}
          onSelect={onSelect}
          onSplit={onSplit}
        ></Friend>
      ))}
    </ul>
  );
}

function Friend({ friend, deleteFriend, onSelect, onSplit }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} ows you {friend.balance}$
        </p>
      )}
      {friend.balance === 0 && <p>you and {friend.name} are even</p>}
      <button className="button" onClick={() => {onSelect(friend); onSplit(true)}}>
        Select
      </button>
      <FontAwesomeIcon
        icon={faTrash}
        className="icon"
        onClick={() => deleteFriend(friend.id)}
      />
    </li>
  );
}
function Button({ children, closeAddFriend }) {
  return (
    <button className="button" onClick={closeAddFriend}>
      {children}
    </button>
  );
}

function FormAddFriend({ addFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name || !image) return;
    addFriend(name, image);
    setName("");
  };
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        type="text"
        value={name}
        placeholder="name"
        onChange={(e) => setName(e.target.value)}
      />
      <label>Image url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <button className="button" type="submit">
        Add
      </button>
    </form>
  );
}
function FormSplitBill({ friend, onSplit }) {
  const [billAmount, setBillAmount] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("you");
  const friendExpense = billAmount - yourExpense;
  const handleSplit = (e) => {
    e.preventDefault();
    onSplit(false);
    setBillAmount("");
    setYourExpense("");
    if (!billAmount || !yourExpense) return;
    if (whoIsPaying === "you") friend.balance += friendExpense;
    else friend.balance -= yourExpense;
  };
  return (
    <form className="form-split-bill" onSubmit={handleSplit}>
      <h2>split a bill with {friend.name}</h2>

      <label>Bill amount</label>
      <input
        type="text"
        value={billAmount}
        onChange={(e) => setBillAmount(e.target.value)}
      />

      <label>your expense</label>
      <input
        type="text"
        value={yourExpense}
        onChange={(e) => setYourExpense(e.target.value)}
      />

      <label>{friend.name}'s expense</label>
      <input type="text" disabled value={friendExpense} />

      <label>who is paying</label>

      <div className="select">
        <div>
          <label htmlFor="you">you</label>
          <input
            type="radio"
            id="you"
            name="pay"
            value="you"
            checked={whoIsPaying === "you"}
            onChange={(e) => setWhoIsPaying(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="friend">{friend.name}</label>
          <input
            type="radio"
            id="friend"
            name="pay"
            value="friend"
            checked={whoIsPaying === "friend"}
            onChange={(e) => setWhoIsPaying(e.target.value)}
          />
        </div>
      </div>
      <button className="button" type="submit">
        Split
      </button>
    </form>
  );
}
export default App;
