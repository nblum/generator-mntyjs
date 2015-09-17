var yeoman = require('yeoman-generator');
var yosay = require('yosay');


module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.Base.apply(this, arguments);
        this.argument('appname', {type: String, required: false});
    },
    prompting: function () {
        var done = this.async();

        this.log(yosay(
            'mntyjs generator'
        ));

        var prompts = [{
            type: 'list',
            name: 'compass',
            message: 'Use compass/sass?',
            choices: ['yes', 'no'],
            default: 'yes',
            store: true
        }, {
            type: 'list',
            name: 'bootstrap',
            message: 'Use bootstrap?',
            choices: ['yes', 'no'],
            default: 'yes',
            store: true
        }];

        if(!this.appname) {
            prompts.unshift({
                type: 'input',
                name: 'appname',
                message: 'Your app name?',
                validate: function (input) {
                    return input.length > 0;
                },
                store: true
            });
        }

        this.prompt(prompts, function (props) {
            props.compass = props.compass !== 'no';
            props.bootstrap = props.bootstrap !== 'no';

            if(this.appname) {
                props.appname = this.appname;
            }

            this.props = props;

            this.log('Your application name: ' + this.props.appname);

            done();
        }.bind(this));
    },

    writing: {
        /**
         * project files
         */
        project: function () {
            this.fs.copy(
                this.templatePath('_package.json'),
                this.destinationPath('package.json')
            );
            this.fs.copy(
                this.templatePath('_bower.json'),
                this.destinationPath('bower.json')
            );

            this.gruntfile.insertConfig(
                "mntyjs",
                "{files: ['web/dev.html'],options : {baseUrl: './',deps: ['bower_components/mntyjs/dist/mnty.js'],loadFrom: 'srcweb/js/plugins',mountPoint: 'mount',out: 'web/js/main.js'}}"
            );

            var compassWatch = "";
            if (this.props.compass) {
                this.gruntfile.insertConfig(
                    "compass",
                    "{prod: {options: {sassDir: 'srcweb/scss',cssDir: 'web/css',environment: 'production'}}, watch:{options:{sassDir:'srcweb/scss',cssDir: 'srcweb/scss'}}}"
                );
                this.gruntfile.loadNpmTasks('grunt-contrib-compass');
                compassWatch = "compass: { files: ['srcweb/scss/**/*.scss'],tasks: ['compass:watch']}";
            }


            this.gruntfile.insertConfig(
                "watch",
                "{" + compassWatch + "}"
            );
            this.gruntfile.loadNpmTasks('grunt-mntyjs')
            this.gruntfile.loadNpmTasks('grunt-contrib-watch');
            this.gruntfile.registerTask('build', ['mntyjs', 'compass:watch', 'compass:prod']);
            this.gruntfile.registerTask('default', ['watch']);
        },
        /**
         * application files
         */
        app: function () {
            this.fs.copyTpl(
                this.templatePath('web/index.html'),
                this.destinationPath('web/index.html'),
                this.props
            );
            this.fs.copyTpl(
                this.templatePath('srcweb/js/plugins/Preloader.js'),
                this.destinationPath('srcweb/js/plugins/Preloader.js'),
                this.props
            );
            this.fs.copyTpl(
                this.templatePath('srcweb/scss/main.scss'),
                this.destinationPath('srcweb/scss/main.scss'),
                this.props
            );
            this.fs.copyTpl(
                this.templatePath('srcweb/scss/partials/_preloader.scss'),
                this.destinationPath('srcweb/scss//partials/_preloader.scss'),
                this.props
            );
            this.fs.copyTpl(
                this.templatePath('srcweb/scss/_variables.scss'),
                this.destinationPath('srcweb/scss/_variables.scss'),
                this.props
            );
            if (!this.props.compass) {
                this.fs.copy(
                    this.templatePath('web/css/main.css'),
                    this.destinationPath('web/css/main.css')
                );
            }
        }
    },

    install: function () {
        if (this.props.compass) {
            this.npmInstall(['grunt-contrib-compass'], {'saveDev': true});
        }

        if (this.props.bootstrap) {
            this.bowerInstall(['bootstrap-sass'], {'saveDev': true});
        }

        this.installDependencies();
    },

    end: function () {
        this.spawnCommand('grunt', ['build']);

        this.log(yosay(
            'Finished setup' +
            '\r\n' +
            'Run `grunt watch` to build files on changes' +
            '\r\n' +
            'Run `grunt build` to build production files manually' +
            '\r\n'
        ));
    }
});