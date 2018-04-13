using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;

namespace watercolor.flamebug.com
{
    public class Startup
    {
        private IHostingEnvironment _hostingEnvironment;

        public AppSettings AppSettings { get; } = new AppSettings();

        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;
            _hostingEnvironment = env;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<AppSettings>(options => Configuration.GetSection("AppSettings").Bind(options));
            //services.AddSingleton<IMarkdownService, CommonMarkDotNetService>();

            //var physicalProvider = _hostingEnvironment.ContentRootFileProvider;
            var physicalProvider = _hostingEnvironment.WebRootFileProvider;
            //var embeddedProvider = new EmbeddedFileProvider(Assembly.GetEntryAssembly());
            //var compositeProvider = new CompositeFileProvider(physicalProvider, embeddedProvider);

            // choose one provider to use for the app and register it
            services.AddSingleton<IFileProvider>(physicalProvider);
            //services.AddSingleton<IFileProvider>(embeddedProvider);
            //services.AddSingleton<IFileProvider>(compositeProvider);

            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
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


/*


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

*/
    }
}
