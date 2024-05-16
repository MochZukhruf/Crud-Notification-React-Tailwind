import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div className="navbar bg-zinc-800 px-48  ">
      <div className="flex-1">
        <Link to={"/"} className="btn btn-ghost text-xl text-cyan-50">
          Crud Notification
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li className="text-cyan-50">
            <Link to="/table" className="btn btn-ghost text-xl text-cyan-50">
              Table
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
