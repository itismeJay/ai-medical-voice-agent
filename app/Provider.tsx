"use client";
import React, { useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { UserDetailContext } from "@/context/UserDetailsContext";

export type UserDetail = {
  name: string;
  email: string;
  credits: number;
};

export function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState<UserDetail | undefined>();

  useEffect(() => {
    if (user) {
      createorGetUser();
    }
  }, [user]);

  const createorGetUser = async () => {
    const result = await axios.post("/api/users");
    console.log(result.data); // Log the user detail for debugging
    setUserDetail(result.data);
  };

  return (
    <div>
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <div>{children}</div>
      </UserDetailContext.Provider>
    </div>
  );
}
