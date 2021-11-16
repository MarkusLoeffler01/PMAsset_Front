import https from "https";
import fs from "fs";
import path from "path";
import url from "url";

const options = {
    key: fs.readFileSync(path.join(__dirname, "certs/key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "certs/cert.pem"))
};

https.createServer(options, async (req, res) => {
    let requrl = path.join(__dirname, `../out/${req.url?.substr(1)}`);
    if(req.url === undefined) return;
    const urlstring = url.parse(req.url);
    if(urlstring.pathname && urlstring.pathname != "/" && !urlstring.pathname.endsWith(".html")) {
        console.log("Ist keine HTML");
        console.log(urlstring.pathname);
        console.log(requrl);
        if(fs.existsSync(requrl)) {
            if(fs.lstatSync(requrl).isDirectory()) {
                requrl = path.join(requrl, "index.html");
            }
            if(fs.existsSync(requrl) && (requrl.endsWith(".js") || requrl.endsWith(".mjs")))
            {
                console.log("Server requestred JS file");
                res.writeHead(200, {
                    "Content-Type": "application/javascript"
                });
                return res.end(fs.readFileSync(requrl));
            }

            if(fs.existsSync(requrl)) { res.writeHead(200); return res.end(fs.readFileSync(requrl)); }
            res.writeHead(404); 
            return res.end(fs.readFileSync(path.join(__dirname, "../out/404.html")));
            
        }
        res.writeHead(404);
        return res.end(fs.readFileSync(path.join(__dirname, "../out/404.html")));
    }
    console.log(requrl);
    if(fs.existsSync(requrl))
    {
        console.log(`Existiert: ${requrl}`)
        res.writeHead(200);
        if(fs.lstatSync(requrl).isDirectory()) return res.end(fs.readFileSync(path.join(requrl, "index.html")));

        console.log("Nö");
        return res.end(fs.readFileSync(requrl));
    }
    else
    {
        res.writeHead(404);
        return res.end(fs.readFileSync(path.join(__dirname, "../out/404.html")));
    }
}).listen(process.env.PORT || 3000).on("listening", () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
});

//create a function to handle requests and send response