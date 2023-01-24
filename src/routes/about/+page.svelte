<style>
    * {
        color: rgb(177, 175, 175);
    }
    #about {
        display: flex;
        justify-content: center;
        margin: 0;
    }
    #wrapper {
        max-width: 650px;
        margin: 40px auto;
        justify-content: center;
        line-height: 1.6;
        font-size: 18px;
        padding: 0 10px;
    }
    h3 {
        width: 10rem;
        text-align: center;
        line-height: 1.2;
        margin: auto;
    }
    a:hover {
        color: #009879;
    }
</style>

<div id="about">
    <div id="wrapper">
        <div>
            <h3>What's Up</h3>
            <p>The Refresh button will make a request to the Logger API. The Logger API will look in the directory where SeaweedFS places it's logs, open the files, parse the logs, and send them to <a href="https://pocketbase.io/">PocketBase</a>. Then, this website requests the logs from PocketBase and displays them!</p>
        </div>
        <div>
            <h3>How To</h3>
            <p>The Settings page will allow you to enter the 'Admin' email and password to get access to the logs. This is a requirement of PocketBase. Ask whoever gave you this tool for more information!</p>
            <p>The Logger API will never parse logs of it's own accord, so press that Refresh button for fresh logs!</p>
            <p>To search the logs effectively, search for <em>exact terms</em>. The search engine is fairly simple and works best when file names, single words, or dates are entered.</p>
            <p>To sort the columns(level, date, time or server) in Descending order, click the word(eg. date) once. To sort said columns in Ascending order, click the word a second time. To clear the sort, click the word a third time!</p>
        </div>
        <div>
            <h3>Go Try it!</h3>
            <p>Thanks for taking the time to read this and use this tool! Have fun and remember to take a deep breath when you're running up against a frustrating bug :)</p>
        </div>
    </div>
</div>