function hideAllContent()
{
	$(".fb-tabview-content > li").hide();
}

function setTabContainerWidth()
{

	$('.fb-tabview-tabs').each(function() {

		var numberOfTabs = 0;
		var widthOfTabs = 0;

    		$(this).children().each(function() {

			numberOfTabs++;
			widthOfTabs += $(this).width();
		});

		var containerWidth = widthOfTabs + (numberOfTabs - 1); 
		$(this).width(containerWidth);
	});

}

function selectAllFirstTabs()
{
	$(".fb-tabview-tabs > li:first-child").addClass("active").show();
}

function selectAllFirstContent()
{
	$(".fb-tabview-content > li:first-child").show();
}

function registerTabClickEvent()
{
	$(".fb-tabview-tabs > li").click(function() {

		selectTab(this);
		showContent(this);
		return false;

	});
}

function selectTab(rel)
{
	$(rel).parent().children("li").removeClass("active");	//Remove any "active" class
	$(rel).addClass("active");				//Add "active" class to selected tab
}

function showContent(rel)
{
	//Showing active content
	var activeTab = $(rel).find("a").attr("href"); 		//Find the rel attribute value to identify the active tab + content
	$(activeTab).parent().children().hide();		//Hide all content
	//$(activeTab).fadeIn();				//Fade in the active content
	$(activeTab).show();					//Show the active content
}

//
// Auto Plugin elements with .fb-tabview class
//

$(function () {

	//$(".fb-tabview").flamebug_TabView();

	hideAllContent();
	selectAllFirstContent();

	//setTabContainerWidth();
	selectAllFirstTabs();
	registerTabClickEvent();

});