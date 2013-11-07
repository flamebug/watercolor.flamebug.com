﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Hosting;

using flamebug.Storage;
using flamebug.Web;
using flamebug.Web.Mvc;
using flamebug.Diagnostics;

namespace design.flamebug.com.Controllers
{
	public class ScssController : Controller
	{
		public ActionResult Style(string id)
		{
			try
			{
				var timer = new Timer();
				timer.Start();

				var file = ((new Path("~/Content/Styles/")) + id).ToFile();

				if (file.Exists())
				{
					//return Content("/* Processed file : " + id + "*/", "text/css");

					/*if (GetRequestLastModified() == file.LastWriteTime)
					{
						Response.StatusCode = 304;
						Response.Status = "304 Not Modified";
						return Content(String.Empty);
					}*/

					Response.Cache.SetLastModified(file.LastWriteTime);

					string css = null;

					if (file.Extension.ToLowerInvariant() == ".scss")
						css = GetScss(file);
					else
						css = GetCss(file);

					timer.Stop();

					Response.AddHeader("X-Processing-Time", timer.FormattedElapsed);
					
					return Content(css, "text/css");
				}

				throw new HttpException(404, "File not found: " + file.Path.Absolute);
			}
			catch (Exception ex)
			{
				throw new HttpException(404, ex.Message);
			}
		}

		private string GetScss(File file)
		{
			try
			{
				Response.AddHeader("X-Stylesheet-Type", "scss");

				var style = new Style(file);

				return style.Content;
			}
			catch (Exception ex)
			{
				return "/*" + Environment.NewLine + "Error in file: " +
					file.Path.Absolute + ":" +
					Environment.NewLine +
					ex.ToString() +
					Environment.NewLine +
					"*/";
			}
		}

		private string GetCss(File file)
		{
			try
			{
				Response.AddHeader("X-Stylesheet-Type", "css");

				return file.Read();
			}
			catch (Exception ex)
			{
				return "/* Error in file: " + file.Name + " */" + Environment.NewLine + "/* " + ex.ToString() + " */";
			}
		}

		/// <summary>
		/// Get the last modified date from the incoming request
		/// </summary>
		/// <param name="request">Http Request</param>
		/// <returns>Last modified date from the incoming request</returns>
		private DateTime GetRequestLastModified()
		{
			DateTime lastmod = DateTime.MinValue;

			string date = Request.Headers["If-Modified-Since"];

			if (date != null)
				lastmod = DateTime.Parse(date);

			return lastmod;
		}
	}
}