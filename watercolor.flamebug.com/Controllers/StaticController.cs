using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using flamebug.Storage;

namespace design.flamebug.com.Controllers
{
	public class StaticController : Controller
	{
		public ActionResult Index(string path)
		{
			if (String.IsNullOrEmpty(path))
				path = "index";

			var file = new File("~/Views/Static/" + path + ".cshtml");

			if (file.Exists())
				return View("~/Views/Static/" + path + ".cshtml");
			else
				return Content("not found");
		}

	}
}
