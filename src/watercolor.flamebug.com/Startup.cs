using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Diagnostics;
using Microsoft.AspNet.Hosting;
using Microsoft.Framework.ConfigurationModel;
using Microsoft.Framework.DependencyInjection;
using Microsoft.Framework.Logging;

namespace watercolor.flamebug.com
{
    public class Startup
    {
        public IConfiguration Configuration { get; set; }

        //
        // 1.  Run Startup
        //
        //          Register config.json
        //          Register environment variables
        //

        public Startup(IHostingEnvironment env)
        {
            Configuration = new Configuration()
                .AddJsonFile("config.json")
                .AddEnvironmentVariables();
        }

        //
        // 2.  Run ConfigureServices
        //
        //          Register AppSettings as a service
        //          Register MVC as a service
        //

        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<AppSettings>(Configuration.GetSubKey("AppSettings"));

            services.AddMvc();
        }

        //
        // 3.  Run Configure
        //
        //          Add console logging
        //          Add the error page/handler depending on environment
        //          Add the status code pages for 404/500 type errors
        //          Add static files
        //          Add MVC and define routes
        //          

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory log)
        {
            log.AddConsole();

            if (env.IsEnvironment("Development"))
            {
                app.UseBrowserLink();
                app.UseErrorPage(ErrorPageOptions.ShowAll);
            }
            else
            {
                app.UseErrorHandler("/error");
            }

            app.UseStatusCodePagesWithReExecute("/error/status/{0}");

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
