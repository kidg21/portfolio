document.addEventListener("DOMContentLoaded", () => {
	const navLinks = document.querySelectorAll("nav a");
	const sections = document.querySelectorAll("main > section");
	const tabButtons = document.querySelectorAll(".tab-button");
	const tabContents = document.querySelectorAll(".tab-content");
	const tabDropdown = document.querySelector(".tab-dropdown");

	// Load external template into tab-content or section
	function loadTabContent(tabId) {
		const tab = document.getElementById(tabId);
		if (!tab) return;
		const template = tab.getAttribute("data-template");
		if (template && !tab.hasAttribute("data-loaded")) {
			fetch(template)
				.then((response) => response.text())
				.then((html) => {
					tab.innerHTML = html;
					tab.setAttribute("data-loaded", "true");
				});
		}
	}

	function setActiveTab(target) {
		tabContents.forEach((content) => {
			content.classList.remove("active");
		});
		tabButtons.forEach((button) => {
			button.classList.remove("active");
		});
		document.getElementById(target).classList.add("active");
		const activeButton = document.querySelector(
			'.tab-button[data-tab="' + target + '"]'
		);
		if (activeButton) activeButton.classList.add("active");
		loadTabContent(target);
	}

	function setActiveNav(tab) {
		navLinks.forEach((link) => {
			link.classList.remove("selected");
		});
		const activeNav = document.querySelector('nav a[data-tab="' + tab + '"]');
		if (activeNav) activeNav.classList.add("selected");
	}

	navLinks.forEach((link) => {
		link.addEventListener("click", () => {
			const target = link.getAttribute("data-tab");

			sections.forEach((section) => {
				section.style.display = "none";
			});

			document.getElementById(target).style.display = "block";
			setActiveNav(target);
			loadTabContent(target);

			// Reset scroll position when switching between Resume and Projects
			if (target === "resume" || target === "projects") {
				window.scrollTo({ top: 0, behavior: "auto" });
			}

			// Debugging: Log when Projects tab is selected
			if (target === "projects") {
				console.log("Projects tab selected");
				setActiveTab("project1");
				console.log("Project 1 should now be active");
				if (tabDropdown) tabDropdown.value = "project1";
			}
		});
	});

	// Default to showing the first section
	sections.forEach((section) => (section.style.display = "none"));
	document.getElementById("resume").style.display = "block";
	setActiveNav("resume");
	loadTabContent("resume");

	tabButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const target = button.getAttribute("data-tab");
			setActiveTab(target);
			if (tabDropdown) tabDropdown.value = target;
		});
	});

	if (tabDropdown) {
		tabDropdown.addEventListener("change", (e) => {
			const target = e.target.value;
			setActiveTab(target);
		});
	}

	// Preload Project 1 content on first load
	loadTabContent("project1");

	// Lightbox functionality
	const lightbox = document.getElementById("lightbox");
	const lightboxImg = document.querySelector(".lightbox-img");
	const lightboxClose = document.querySelector(".lightbox-close");

	document.body.addEventListener("click", function (e) {
		if (e.target.tagName === "IMG" && e.target.closest(".tab-content")) {
			lightboxImg.src = e.target.src;
			lightbox.style.display = "flex";
		}
	});

	lightboxClose.addEventListener("click", function () {
		lightbox.style.display = "none";
		lightboxImg.src = "";
	});

	lightbox.addEventListener("click", function (e) {
		if (e.target === lightbox) {
			lightbox.style.display = "none";
			lightboxImg.src = "";
		}
	});
});
