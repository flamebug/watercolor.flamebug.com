using Microsoft.AspNet.Antiforgery;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Diagnostics;
using Microsoft.AspNet.Hosting;
using Microsoft.Dnx.Runtime;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace watercolor.flamebug.com
{
    public class Startup
    {
        public IConfiguration Configuration { get; set; }

        //
        // 1.  Run Startup
        //
        //          Register appsettings.json
        //          Register environment variables
        //

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            Configuration = builder.Build();
        }

		public AppSettings AppSettings { get; } = new AppSettings();

        //
        // 2.  Run ConfigureServices
        //
        //          Register AppSettings as a service
        //          Register MVC as a service
        //          Register Antiforgery as a service
        //

        public void ConfigureServices(IServiceCollection services)
        {
			services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));

            services.AddMvc();

			services.AddAntiforgery();
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
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/error");
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
