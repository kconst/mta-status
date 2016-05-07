var Dispatcher = require('./js/Dispatcher'),
    Pager = require('./js/Pager'),
    Mta = require('mta-gtfs'),
    config = require('./config'),

    mta = new Mta({
        key : config.MTA_KEY,
        feed_id : 1
    }),

    User = {
        name : '',
        phone : '',
        lines : [],
        addPeriods : function (pager) {
            this.periods.push(new Pager(pager));

            return this;
        },
        periods : []
    },

    users = [
        {
            name : 'Kyle',
            lines : [2,3,4],
            phone : '+13474508587',
            periods : [
                {
                    begin : '7:30',
                    end : '9:30'
                },
                {
                    begin : '16:30',
                    end : '18:00'
                }
            ]
        },
        {
            name : 'Kristen',
            lines : [0,2,3],
            phone : '+12076534875',
            periods : [
                {
                    begin : '7:30',
                    end : '9:30'
                },
                {
                    begin : '16:30',
                    end : '18:00'
                }
            ]
        }
    ];

users.forEach(function(person, i, arr){
    var obj = Object.create(User);

    obj.name = person.name;

    obj.lines = person.lines;

    obj.phone = person.phone;

    person.periods.forEach(function(period){
        obj.addPeriods({
            begin : period.begin,
            end : period.end,
            cb : function (){
                return mta.status('subway')
                    .then(checkLineAlerts.bind(this));
            }.bind(this)
        });
    }.bind(obj));


    arr[i] = obj;
});

function checkLineAlerts(result) {
    var lines = this.lines,
        msg = '';

    console.log(this.name);

    lines.forEach(function(e){
        if (result[e].status !== 'GOOD SERVICE' && result[e].status !== 'PLANNED WORK') {
            msg += ('(' + result[e].name + ' Line) - ' + result[e].Time + ' - ' + result[e].status + '\n');
        }
    });

    console.log('"' + msg + '"');

    if (msg) {
        // disabled while testing
        //Dispatcher.sendSms(this.phone, msg);
    }
}