module.exports = [
    {
        uri: '/hello-world.html',
        status: 200,
        time: 0,
        body: '<h1>Hello World!</h1>',
        headers: {
            'Content-Type': 'text/html; charset=UTF-8',
        },
        velocity: {
            enabled: true,
        }
    },
    {
        uri: '/hello-world.json',
        status: 200,
        time: 0,
        body: '{"hello": "world !"}',
        headers: {
            'Content-Type': 'application/json',
        },
        velocity: {
            enabled: true,
        }
    },
    {
        uri: '/hello/:world',
        status: 200,
        time: 0,
        body: '<h1>Hello $params.world!</h1>',
        headers: {
            'Content-Type': 'text/html; charset=UTF-8',
        },
        velocity: {
            enabled: true,
        }
    }
];
