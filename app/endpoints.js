module.exports = [
    {
        uri: '/internetbs/domain/Check',
        status: 200,
        time: 0,
        body: `
#set($random=$math.random())
#set($random=$random * 10)
#set($random=$math.round($random))
$req.query.Domain
transactid=b827569b003d1b3b6b4f373074f480d0
status=AVAILABLE
domain=tytytopol.com
minregperiod=1Y
maxregperiod=10Y
registrarlockallowed=YES
privatewhoisallowed=YES
realtimeregistration=YES
price_ispremium=NO
            
transactid=16fc8c8c7eda0d2fe383d1ed38906604
status=UNAVAILABLE
domain=google.fr`,
        headers: {
            'Content-Type': 'text/plain; charset=utf-8'
        },
        velocity: {
            enabled: true
        }
    }
];
