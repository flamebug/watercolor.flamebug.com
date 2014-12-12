using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace design.flamebug.com
{
	// Note: For instructions on enabling IIS6 or IIS7 classic mode, 
	// visit http://go.microsoft.com/?LinkId=9394801

	public class MvcApplication : System.Web.HttpApplication
	{
		public static void RegisterGlobalFilters(GlobalFilterCollection filters)
		{
			filters.Add(new HandleErrorAttribute());
		}

		public static void RegisterRoutes(RouteCollection routes)
		{
			routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

			//routes.MapRoute("Scss",
			//	"Styles/{*id}",
			//	new { controller = "Scss", action = "Style", id = UrlParameter.Optional } // Parameter defaults
			//);

			routes.MapRoute("Static",
				"{*path}",
				new { controller = "Static", action = "Index", id = UrlParameter.Optional } // Parameter defaults
			);

		}

		protected void Application_Start()
		{
			AreaRegistration.RegisterAllAreas();

			RegisterGlobalFilters(GlobalFilters.Filters);
			RegisterRoutes(RouteTable.Routes);
		}
	}
}