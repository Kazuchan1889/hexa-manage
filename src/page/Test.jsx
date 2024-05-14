import React from "react";
import Calendar from "../minicomponent/Calender";

function Test() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>My Calendar App</h1>
            </header>
            <main className="mt-8">
                <Calendar />
            </main>
        </div>
    )
}

export default Test;