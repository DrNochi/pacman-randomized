import WebSocket from 'ws'
const wss = new WebSocket.Server({ port: 5001 })

export async function introspect(game, ...args) {
    if (wss.clients.size) {
        for (const arg of args)
            console.log(arg)

        wss.clients.forEach(client => {
            if (client.readyState == WebSocket.OPEN)
                client.send(JSON.stringify(game))
        })

        await new Promise(res => setTimeout(res, 16))
    }
}
