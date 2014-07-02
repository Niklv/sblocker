module.exports = function (grunt) {
    grunt.initConfig({
        uglify: {
            default: {
                options: {
                    preserveComments: false,
                    report: 'min'

                },
                files: {
                    'public/js/lib.js': [
                        'bower_components/jquery/dist/jquery.min.js',
                        'bower_components/underscore/underscore.js',
                        'bower_components/socket.io-client/socket.io.js',
                        'bower_components/metisMenu/jquery.metisMenu.js',
                        'bower_components/bootstrap/dist/js/bootstrap.min.js',
                        'bower_components/datatables/media/js/jquery.dataTables.js',
                        'public/js/lib/serializeObject.jquery.js',
                        'public/js/lib/dataTables.bootstrap.js'
                    ]
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['uglify']);
};