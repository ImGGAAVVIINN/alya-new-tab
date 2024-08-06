(function(e) {
    "use strict";
    e.SEARCH_ENGINES = {
        google: {
            ShortName: "Qwant",
            LongName: "Qwant Search",
            InputEncoding: "UTF-8",
            SearchUrl: "https://www.qwant.com/?q={searchTerms}",
            SuggestUrl: "https://suggestqueries.google.com/complete/search?client=chrome&ie=utf-8&oe=utf-8&hl={lang}&gl={country}&q={searchTerms}",
            Images: "https://www.google.com/search?biw=1235&bih=730&tbm=isch&sa=1&btnG=Search&q=",
            Videos: "https://www.google.com/search?tbm=vid&hl=en&source=hp&biw=&bih=&btnG=Google+Search&oq=&gs_l=&q=",
            SearchForm: "https://www.google.com/"
        }
    };
    var t = SEARCH_ENGINES["google"];
    function o(e, t) {
        var o = e;
        for (var a in t) {
            var s = t[a];
            var i = new RegExp("\\{" + a + "\\}","gi");
            o = o.replace(i, s)
        }
        return o
    }
    function a() {
        var a = document.querySelector("#search-input").value;
        if (a == "" || a == null)
            return;
        $("#search-suggestion-pad").remove();
        var s;
        var i = utils.locale;
        i = i.replace("_", "-");
        if (a.trim().length > 0 || t.SearchForm == null) {
            var n = t.SearchUrl;
            s = o(n, {
                searchTerms: encodeURIComponent(a),
                lang: i
            })
        } else {
            s = t.SearchForm
        }
        e.top.location.href = s
    }
    var s = "web";
    user["selected_cat"] = s;
    $(document).ready(function() {
        d();
        var o = $("#search-input");
        var i = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var n = "4c48e554026a4c9e97b3b2dc8824b559";
        var r = $("#weather");
        var l = $("input[type=search]");
        var u = [];
        if (localStorage.getItem("hideLink"))
            u = JSON.parse(localStorage.getItem("hideLink"));
        var c = [];
        if (localStorage.getItem("hideApp"))
            c = JSON.parse(localStorage.getItem("hideApp"));
        function d() {
            $("#tool_menu").html(`\n        <div><a id="tool_myaccount"  href="https://myaccount.google.com/"><i class="icon_myaccount"></i>My Account</a><div class="closebtn" hide-app="https://myaccount.google.com/"></div></div>\n        <div><a id="tool_gmail"      href="https://mail.google.com/mail/"><i class="icon_gmail"></i>Gmail</a><div class="closebtn" hide-app="https://mail.google.com/mail/"></div></div>\n        <div><a id="tool_youtube"    href="https://www.youtube.com/"><i class="icon_youtube"></i>Youtube</a><div class="closebtn" hide-app="https://www.youtube.com/"></div></div>\n        <div><a id="tool_drive"      href="https://drive.google.com/"><i class="icon_drive"></i>Drive</a><div class="closebtn" hide-app="https://drive.google.com/"></div></div>\n        <div><a id="tool_documents"  href="https://docs.google.com/document/"><i class="icon_documents"></i>Docs</a><div class="closebtn" hide-app="https://docs.google.com/document/"></div></div>\n        <div><a id="tool_calendar"   href="https://calendar.google.com/"><i class="icon_calendar"></i>Calendar</a><div class="closebtn" hide-app="https://calendar.google.com/"></div></div>\n        <div><a id="tool_photos"     href="https://photos.google.com/"><i class="icon_photos"></i>Photos</a><div class="closebtn" hide-app="https://photos.google.com/"></div></div>\n        <div><a id="tool_googleplus" href="https://plus.google.com/"><i class="icon_googleplus"></i>Google+</a><div class="closebtn" hide-app="https://plus.google.com/"></div></div>\n        <div><a id="tool_googlemap"  href="https://maps.google.com/"><i class="icon_googlemap"></i>Google Maps</a><div class="closebtn" hide-app="https://maps.google.com/"></div></div>\n        <div><a id="tool_translate"  href="https://translate.google.com/"><i class="icon_translate"></i>Google Translate</a><div class="closebtn" hide-app="https://translate.google.com/"></div></div>\n        <div><a id="tool_classroom"  href="https://classroom.google.com/"><i class="icon_classroom"></i>Google Classroom</a><div class="closebtn" hide-app="https://classroom.google.com/"></div></div>\n        <hr>\n        <div><a id="tool_facebook"   href="https://www.facebook.com/"><i class="icon_facebook"></i>Facebook</a><div class="closebtn" hide-app="https://www.facebook.com/"></div></div>\n        <div><a id="tool_amazon"     href="https://www.amazon.com/"><i class="icon_amazon"></i>Amazon</a><div class="closebtn" hide-app="https://www.amazon.com/"></div></div>\n        <div><a id="tool_ebay"       href="https://www.ebay.com/"><i class="icon_ebay"></i>Ebay</a><div class="closebtn" hide-app="https://www.ebay.com/"></div></div>\n        <div><a id="tool_wikipedia"  href="https://www.wikipedia.org/"><i class="icon_wikipedia"></i>Wikipedia</a><div class="closebtn" hide-app="https://www.wikipedia.org/"></div></div>\n        <div><a id="tool_reddit"     href="https://www.reddit.com/"><i class="icon_reddit"></i>Reddit</a><div class="closebtn" hide-app="https://www.reddit.com/"></div></div>\n        `);
            var e = ["Gmail", "YouTube", "Drive", "Docs", "Contacts", "Photos", "Calendar", "Google+", "Hangouts", "Google Maps", "Google Classroom", "Google Search"];
            function t(t) {
                for (var o = 0; o < e.length; o++) {
                    if (e[o] === t || "Google " + e[o] === t) {
                        return true
                    }
                }
                return false
            }
            chrome.runtime.sendMessage({
                appGetAll: true
            }, function(e) {
                var o = e.filter(function(e) {
                    return typeof e.appLaunchUrl !== "undefined"
                });
                for (var a = 0; a < o.length; a++) {
                    var s = o[a];
                    if (t(s.name)) {
                        continue
                    }
                    var i = document.createElement("DIV");
                    var n = document.createElement("A");
                    var r = document.createElement("I");
                    var l = document.createTextNode(s.name);
                    var u = document.createElement("DIV");
                    u.className = "closebtn";
                    u.setAttribute("hide-app", "app:" + s.id);
                    r.setAttribute("style", "background-image:url('" + s.icons[0].url + "');background-size:cover;");
                    n.setAttribute("id", s.id);
                    n.addEventListener("click", function() {
                        chrome.runtime.sendMessage({
                            appLaunch: {
                                id: this.id
                            }
                        })
                    });
                    n.appendChild(r);
                    n.appendChild(l);
                    i.appendChild(n);
                    i.appendChild(u);
                    document.getElementById("tool_menu").appendChild(i);
                    if (localStorage.getItem("hideApp")) {
                        if (JSON.parse(localStorage.getItem("hideApp")).length > 0) {
                            f("tool_menu", "Apps")
                        }
                    }
                }
                if (localStorage.getItem("hideApp")) {
                    c = JSON.parse(localStorage.getItem("hideApp"));
                    c.forEach((e,t)=>{
                        $(`#tool_menu a[href='${e}']`).parent().hide()
                    }
                    )
                }
                p()
            });
            if (localStorage.getItem("hideApp")) {
                c = JSON.parse(localStorage.getItem("hideApp"));
                if (c.length > 0) {
                    g("apps")
                }
            }
        }
        m();
        function m() {
            chrome.runtime.sendMessage({
                topSites: true
            }, function(e) {
                var t = 0;
                $("#topsites_menu").html('<p id="cantFixLol">  ‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎Your most visited sites!</p>');
                for (var o = 0; o < e.length; o++) {
                    if (u.indexOf(e[o].url) >= 0) {
                        continue
                    } else {
                        $("#topsites_menu").append($("<hr>"));
                        $("#topsites_menu").append($('<div><a href="' + e[o].url + '"><i style="background-image:url(\'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(e[o].url) + "');background-size:cover;\"></i>" + e[o].title + '</a><div class="closebtn" close-for="' + e[o].url + '"></div></div>'));
                        t++;
                        if (t >= 10)
                            break
                    }
                }
                utils.resetClickHandler($("#topsites_menu a"), function(e) {
                    chrome.runtime.sendMessage("click-TopSites")
                });
                if (localStorage.getItem("hideLink")) {
                    if (JSON.parse(localStorage.getItem("hideLink")).length > 0) {
                        f("topsites_menu", "Links")
                    }
                }
                p()
            })
        }
        function p() {
            utils.resetClickHandler($(".closebtn"), function() {
                if ($(this).attr("close-for")) {
                    u.push($(this).attr("close-for"));
                    localStorage.setItem("hideLink", JSON.stringify(u));
                    utils.storageSync();
                    m();
                    $("#msg").text("Link removed");
                    g("mostVisited")
                } else if ($(this).attr("hide-app")) {
                    c.push($(this).attr("hide-app"));
                    $(this).parent().remove();
                    localStorage.setItem("hideApp", JSON.stringify(c));
                    utils.storageSync();
                    $("#msg").text("App removed");
                    $(".undo-box").removeClass("undo-box-hide");
                    g("apps")
                }
                chrome.runtime.sendMessage({
                    syncOptionsNow: true
                })
            })
        }
        var h = null;
        function g(e) {
            v();
            if (localStorage.getItem("hideApp")) {
                if (JSON.parse(localStorage.getItem("hideApp")).length > 0) {
                    f("tool_menu", "Apps")
                }
            }
            if (localStorage.getItem("hideLink")) {
                if (JSON.parse(localStorage.getItem("hideLink")).length > 0) {
                    f("topsites_menu", "Links")
                }
            }
            utils.resetClickHandler($("#undobtn"), function() {
                if (e === "mostVisited") {
                    u.pop();
                    localStorage.setItem("hideLink", JSON.stringify(u));
                    utils.storageSync();
                    $("#topsites_menu").empty();
                    m()
                } else if (e === "apps") {
                    c.pop();
                    localStorage.setItem("hideApp", JSON.stringify(c));
                    utils.storageSync();
                    $("#tool_menu").empty();
                    d()
                }
                $(".undo-box").addClass("undo-box-hide");
                chrome.runtime.sendMessage({
                    syncOptionsNow: true
                })
            });
            $("#close-undo-box-btn").off("click");
            $("#close-undo-box-btn").click(function() {
                $(".undo-box").addClass("undo-box-hide");
                $("#undobtn").off("click")
            });
            if (h) {
                $(".undo-box").hover(function() {
                    clearTimeout(h)
                }, function() {
                    v()
                })
            }
        }
        function f(e, t) {
            let o = $("<div>", {
                class: e + "_restore"
            });
            if ($(`.${e}_restore`).size() <= 0) {
                o.html(`<a class="${e + "_restoreBtn"}" restore-for = "${e}"><i class="restoreBtn"></i>Restore ${t}</a>`);
                $(`#${e}`).append("<hr>").append(o);
                $(`.${e + "_restoreBtn"}`).click(function() {
                    $(`#${$(this).attr("restore-for")}`).empty();
                    if ($(this).attr("restore-for") === "tool_menu") {
                        localStorage.setItem("hideApp", "[]");
                        d()
                    } else if ($(this).attr("restore-for") === "topsites_menu") {
                        localStorage.setItem("hideLink", "[]");
                        u = [];
                        m()
                    }
                    chrome.runtime.sendMessage({
                        syncOptionsNow: true
                    })
                })
            }
        }
        function v(e) {
            if (h) {
                clearTimeout(h);
                h = null
            }
            h = setTimeout(function() {
                $(".undo-box").addClass("undo-box-hide");
                $("#undobtn").off("click")
            }, 7e3);
            if (e) {
                clearTimeout(h)
            }
        }
        var _ = function() {
            $("#topsites_menu").fadeOut(200);
            $("#share_menu").fadeOut(200);
            $("#support_menu").fadeOut(200);
            $("#tool_menu").fadeOut(200)
        };
        $("nav").off("mouseleave");
        $("nav").on("mouseleave", _);
        $("footer").off("mouseleave");
        $("footer").on("mouseleave", _);
        $("#topsites_menu").hide();
        utils.resetMouseEnterHandler($("#lnk_topsites"), function(e) {
            e.stopPropagation();
            $("#topsites_menu").show(200);
            $("#share_menu").fadeOut(200);
            $("#support_menu").fadeOut(200);
            $("#tool_menu").fadeOut(200)
        });
        utils.resetClickHandler($("#lnk_topsites"), function(e) {
            e.stopPropagation();
            $("#topsites_menu").toggle(200);
            $("#share_menu").fadeOut(200);
            $("#support_menu").fadeOut(200);
            $("#tool_menu").fadeOut(200)
        });
        utils.resetMouseEnterHandler($("#topsites_menu"), function(e) {
            e.stopPropagation();
            $("#topsites_menu").off("mouseleave");
            $("#topsites_menu").on("mouseleave", _)
        });
        utils.resetClickHandler($("#topsites_menu"), function(e) {
            e.stopPropagation()
        });
        $("#share_menu").hide();
        utils.resetMouseEnterHandler($("#lnk_share"), function(e) {
            e.stopPropagation();
            $("#topsites_menu").fadeOut(200);
            $("#share_menu").show(200);
            $("#support_menu").fadeOut(200);
            $("#tool_menu").fadeOut(200)
        });
        utils.resetClickHandler($("#lnk_share"), function(e) {
            e.stopPropagation();
            $("#topsites_menu").fadeOut(200);
            $("#share_menu").toggle(200);
            $("#support_menu").fadeOut(200);
            $("#tool_menu").fadeOut(200)
        });
        utils.resetMouseEnterHandler($("#share_menu"), function(e) {
            e.stopPropagation();
            $("#share_menu").off("mouseleave");
            $("#share_menu").on("mouseleave", _)
        });
        utils.resetClickHandler($("#share_menu"), function(e) {
            e.stopPropagation();
            _()
        });
        $("#support_menu").hide();
        utils.resetMouseEnterHandler($("#lnk_support"), function(e) {
            e.stopPropagation();
            $("#topsites_menu").fadeOut(200);
            $("#share_menu").fadeOut(200);
            $("#support_menu").show(200);
            $("#tool_menu").fadeOut(200)
        });
        utils.resetClickHandler($("#lnk_support"), function(e) {
            e.stopPropagation();
            $("#topsites_menu").fadeOut(200);
            $("#share_menu").fadeOut(200);
            $("#support_menu").toggle(200);
            $("#tool_menu").fadeOut(200)
        });
        utils.resetMouseEnterHandler($("#support_menu"), function(e) {
            e.stopPropagation();
            $("#support_menu").off("mouseleave");
            $("#support_menu").on("mouseleave", _)
        });
        utils.resetClickHandler($("#support_menu"), function(e) {
            e.stopPropagation();
            _()
        });
        $("#tool_menu").hide();
        utils.resetMouseEnterHandler($("#lnk_tool"), function(e) {
            e.stopPropagation();
            $("#topsites_menu").fadeOut(200);
            $("#share_menu").fadeOut(200);
            $("#support_menu").fadeOut(200);
            $("#tool_menu").show(200)
        });
        utils.resetClickHandler($("#lnk_tool"), function(e) {
            e.stopPropagation();
            $("#topsites_menu").fadeOut(200);
            $("#share_menu").fadeOut(200);
            $("#support_menu").fadeOut(200);
            $("#tool_menu").toggle(200)
        });
        utils.resetMouseEnterHandler($("#tool_menu"), function(e) {
            e.stopPropagation();
            $("#tool_menu").off("mouseleave");
            $("#tool_menu").on("mouseleave", _)
        });
        utils.resetClickHandler($("#tool_menu"), function(e) {
            e.stopPropagation()
        });
        utils.resetClickHandler($(document), function() {
            _();
            $("#search-suggestion-pad").hide();
            if ($("#background_selector_widget").css("opacity") == 1) {
                $("#background_selector_widget").fadeOut()
            }
        });
        function w() {
            k = true;
            b = false
        }
        var b = true;
        var k = false;
        var S = false;
        var y = 5e3;
        function O() {
            clearTimeout(T);
            T = setTimeout(O, y);
            var e = r.find("img").attr("src")
              , t = e;
            $(".widght .time").stop(true, true);
            $(".widght .weather").stop(true, true);
            if (r.hasClass("clock") && b) {
                t = e.replace("clock.png", "cloud.png");
                $(".widght .time").fadeOut(100, function() {
                    $(".widght .weather").fadeIn().css("display", "inline-block");
                    if (S) {
                        $(".widght .time").tooltip("hide");
                        $(".widght .weather").tooltip("show")
                    }
                })
            } else {
                if (localStorage.getItem("disable_weather") == "yes" || k)
                    b = false;
                else
                    b = true;
                t = e.replace("cloud.png", "clock.png");
                $(".widght .weather").fadeOut(100, function() {
                    $(".widght .time").fadeIn().css("display", "inline-block");
                    if (S) {
                        $(".widght .time").tooltip("show");
                        $(".widght .weather").tooltip("hide")
                    }
                })
            }
            r.find("img").attr("src", t);
            r.toggleClass("clock temp")
        }
        $(".widght .time, .widght .weather").on("mouseenter", function() {
            S = true
        });
        $(".widght .time, .widght .weather").on("mouseleave", function() {
            S = false
        });
        $(".widght .weather h1").on("click", function() {
            A(user["units_weather"] == "imperial" ? "metric" : "imperial")
        });
        $(".widght .time").on("click", function() {
            C()
        });
        $("#time_format").off("change");
        $("#time_format").on("change", function(e) {
            user["time_format"] = $(this).val();
            M();
            chrome.runtime.sendMessage({
                syncOptionsNow: true
            })
        });
        $("#date_format").off("change");
        $("#date_format").on("change", function(e) {
            user["date_format"] = $(this).val();
            M();
            chrome.runtime.sendMessage({
                syncOptionsNow: true
            })
        });
        $("#units_weather").off("change");
        $("#units_weather").on("change", function() {
            A($(this).val())
        });
        var I = $("#weather_widget_unit");
        function A(e) {
            if (e != "imperial") {
                user["units_weather"] = "metric";
                user["date_format"] = "{{d}}.{{m}}.{{y}}";
                I.html("C")
            } else {
                user["units_weather"] = "imperial";
                user["date_format"] = "{{m}}.{{d}}.{{y}}";
                I.html("F")
            }
            $("#date_format").val(user["date_format"]);
            $("#units_weather").val(user["units_weather"]);
            w();
            M();
            chrome.runtime.sendMessage({
                syncOptionsNow: true
            });
            utils.storageSync()
        }
        function C() {
            if (user["time_format"] == "12h") {
                user["time_format"] = "24h"
            } else {
                user["time_format"] = "12h"
            }
            $("#time_format").val(user["time_format"]);
            M();
            chrome.runtime.sendMessage({
                syncOptionsNow: true
            });
            utils.storageSync()
        }
        A(user["units_weather"]);
        function M() {
            var t = new Date;
            if (localStorage.getItem("latency")) {
                t = new Date(Number(new Date) + Number(localStorage.getItem("latency")))
            }
            if (user["time_format"] == "12h") {
                var o = t.getHours() < 12 ? "AM" : "PM";
                $(".ampm").html(o);
                $(".ampm").css("display", "inline-block");
                var a = t.getHours();
                if (a == 0)
                    a = 12;
                else if (a > 12)
                    a = a - 12;
                $(".hour").html(a + ":" + ("0" + t.getMinutes()).slice(-2))
            } else {
                $(".hour").html(("0" + t.getHours()).slice(-2) + ":" + ("0" + t.getMinutes()).slice(-2));
                $(".ampm").css("display", "none")
            }
            $(".day").html(i[t.getDay()]);
            $(".num").html(user["date_format"].replace("{{m}}", t.getMonth() + 1).replace("{{d}}", t.getDate()).replace("{{y}}", t.getFullYear()));
            e.reminder()
        }
        var N = setInterval(M, 999);
        var T = setTimeout(O, y);
        if (e.listAllThreads.threadSearchForm) {
            e.listAllThreads.threadSearchForm.pause()
        }
        e.listAllThreads.threadSearchForm = {
            pause: function() {
                clearInterval(N);
                clearTimeout(T)
            },
            resume: function() {
                M();
                clearInterval(N);
                clearTimeout(T);
                N = setInterval(M, 999);
                T = setTimeout(O, y)
            }
        };
        $(".searchInput").attr("placeholder", "Search" + " " + t["ShortName"]);
        const shortName = "<b>" + t["ShortName"] + "</b>";
        const text = "Search with " + shortName;
        const imgHtml = '<img src="https://feren-os.github.io/start-page/resources/pickengine.png" alt="Change the Search Engine..." style="top: -20px; vertical-align: middle;">';
        document.getElementById('replace-me').innerHTML = text + " " + imgHtml;
        $("#search-input").focus();
        $("#search-input").addClass("custom");
        function E() {
            try {
                var o = document.getElementById("search-input");
                var s = t.SuggestUrl;
                e.autoSuggest = new AutoSuggest(o,s,a);
                e.autoSuggest.setSuggestUrl(t["SuggestUrl"])
            } catch (e) {}
        }
        function H() {
            var e = false;
            $("#search-button").click(function() {
                if (s != "web")
                    return;
                if (!e) {
                    e = true;
                    a();
                    setTimeout(function() {
                        e = false
                    }, 1e3)
                }
            });
            $("#search-input").keyup(function(e) {
                if (s != "web") {
                    return
                }
                if (e.keyCode == 13 || e.which == 13) {
                    a.call(this)
                }
            })
        }
        H();
        E();
        utils.storageSync();
        $("#change_city, #error_weather_messager, #weather_info_display").click(function() {
            chrome.runtime.sendMessage("click-ChangeCity")
        });
        chrome.runtime.onMessage.addListener(function(t, o, a) {
            if (t.refreshOptions) {
                e.loadGlobalOptions();
                d()
            } else if (t.refreshRelativeApps) {
                e.loadRelativeApps()
            } else if (t.pauseAllThreads) {
                var s = Object.keys(e.listAllThreads);
                for (var i = 0; i < s.length; i++) {
                    var n = e.listAllThreads[s[i]];
                    if (n && typeof n.pause == "function")
                        n.pause()
                }
            } else if (t.resumeAllThreads) {
                var s = Object.keys(e.listAllThreads);
                for (var i = 0; i < s.length; i++) {
                    var n = e.listAllThreads[s[i]];
                    if (n && typeof n.resume == "function")
                        n.resume()
                }
            }
        })
    })
}
)(this);
