"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");

    async function handelSignup(e) {
        e.preventDefault();

        setMessage("");

        const responce = await fetch("api/auth/signup", {
            method: "POST",

            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                email,
                password
            }),
        });
        const data = await responce.json();
        setMessage(data.message);

        if (responce.ok) {
            router.push("/login");
        }
    }
    return (
        <div style={{ maxWidth: "400px", margin: "100px auto" }}>
            <h1>SignUp</h1>

            <form onSubmit={handelSignup}>

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <br />
                <br />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <br />
                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br />
                <br />

                <button type="submit">Submit</button>
            </form>

            <p>{message}</p>
        </div>
    );
}