using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using System.IO;

namespace ultrabodycontouring.com.Controllers
{
	public class StaticController : Controller
	{
		public ActionResult Index(string path)
		{
			if (String.IsNullOrEmpty(path))
				path = "index";

			var html = "~/Views/Static/" + path + ".cshtml";

			if (System.IO.File.Exists(Server.MapPath(html)))
				return View(html);
			else
				return View("~/Views/Shared/404.cshtml");
		}

	}
}
