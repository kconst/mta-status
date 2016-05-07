Pager = function(args){
    var cb;

    this.begin = args.begin;
    this.end = args.end;
    this.cb = args.cb;

    cb = this.cb;

    setInterval(function(){
        var date = new Date();
        
        if (new Date(date.toDateString() + ' ' + this.begin) < date && new Date(date.toDateString() + ' ' + this.end) > date) {
            cb();

            //now disable so callback is done only once during this period
            cb = function(){};
        } else {
            cb = this.cb;
        }
    }.bind(this), 5000);
};

module.exports = Pager;