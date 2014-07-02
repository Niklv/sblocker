module.exports = function (grunt) {
    grunt.initConfig({
        concat: {
            options: {
                stripBanners: {
                    block: true,
                    line: true
                }
            },
            dist: {
                src: [
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/underscore/underscore.js',
                    'bower_components/metisMenu/jquery.metisMenu.js',
                    'bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'bower_components/datatables/media/js/jquery.dataTables.js',
                    'public/js/lib/serializeObject.jquery.js',
                    'public/js/lib/dataTables.bootstrap.js'
                ],
                dest: 'public/js/lib.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', ['concat']);
};