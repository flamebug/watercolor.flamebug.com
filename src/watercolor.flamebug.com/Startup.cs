using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Diagnostics;
using Microsoft.AspNet.Hosting;
using Microsoft.Framework.Configuration;
using Microsoft.Framework.DependencyInjection;
using Microsoft.Framework.Logging;
using Microsoft.Framework.Runtime;

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

        public Startup(IHostingEnvironment env, IApplicationEnvironment appEnv)
        {
            var builder = new ConfigurationBuilder(appEnv.ApplicationBasePath)
                .AddJsonFile("config.json")
                .AddJsonFile($"config.{env.EnvironmentName}.json", optional: true);

			if (env.IsDevelopment())
			{
				builder.AddUserSecrets();
			}

			builder.AddEnvironmentVariables()

            Configuration = builder.Build();
        }

        //
        // 2.  Run ConfigureServices
        //
        //          Register AppSettings as a service
        //          Register MVC as a service
        //

        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<AppSettings>(Configuration.GetConfigurationSection("AppSettings"));

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

            if (env.IsDevelopment())
            {
                app.UseBrowserLink();
                app.UseErrorPage();
            }
            else
            {
                app.UseErrorHandler("/error");
            }

            app.UseStatusCodePagesWithReExecute("/error/{0}");

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
