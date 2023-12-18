import { Entries } from "../pages/Entries";
import { Account, DeclinedEntries } from "../pages/DeclinedEntries";
import { Home } from "../pages/Home";
import Login from "../pages/Login";
import { Approvals, Private } from "../pages/Approvals";
import { BioData } from "../pages/BioData";

export const nav = [
  {
    path: "/",
    name: "Dashboard",
    element: <Home />,
    isMenu: true,
    isPrivate: false,
  },

  {
    path: "/newEntries",
    name: "New Entries",
    element: <Entries />,
    isMenu: true,
    isPrivate: false,
  },
  {
    path: "/login",
    name: "Login",
    element: <Login />,
    isMenu: false,
    isPrivate: false,
  },

  {
    path: "/bioData",
    name: "BioData",
    element: <BioData />,
    isMenu: false,
    isPrivate: false,
  },
  {
    path: "/approvedEntries",
    name: "Approved Entries",
    element: <Approvals />,
    isMenu: true,
    isPrivate: true,
  },
  {
    path: "/declinedEntries",
    name: "Declined Entries",
    element: <DeclinedEntries />,
    isMenu: true,
    isPrivate: true,
  },
];
