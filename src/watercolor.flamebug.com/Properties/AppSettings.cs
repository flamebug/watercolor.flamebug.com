namespace watercolor.flamebug.com
{
    public class AppSettings
    {
        //Site Specific
        public string domain { get; set; }
        public string sitename { get; set; }
        public string sitetwitter { get; set; }

        //Mail Settings
        public string smtphost { get; set; }
        public string smtpuser { get; set; }
        public string smtppass { get; set; }

        //Contact Form
        public string contactemail { get; set; }
        public string contactsubject { get; set; }
    }
}
