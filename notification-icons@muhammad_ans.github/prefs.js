import Gio from "gi://Gio";
import Adw from "gi://Adw";
import Gtk from "gi://Gtk";

import {
  ExtensionPreferences,
  gettext as _,
} from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

export default class ExamplePreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    const page = new Adw.PreferencesPage({
      title: _("General"),
      icon_name: "dialog-information-symbolic",
    });
    window.add(page);

    const group = new Adw.PreferencesGroup({
      title: _("Configuration"),
      description: _("Configure the extension"),
    });
    page.add(group);

    const row = new Adw.SwitchRow({
      title: _("Right Side"),
      subtitle: _("Whether to show icons on the right side"),
    });
    group.add(row);

    const row2 = new Adw.SwitchRow({
      title: _("Colored Icons"),
      subtitle: _("Toggles between symbolic and colored icons"),
    });
    group.add(row2);

    const options = new Gtk.StringList();
    options.append(_("Always"));
    options.append(_("Urgent"));
    options.append(_("Never"));

    const comboRow = new Adw.ComboRow({
      title: _("DND Mode"),
      subtitle: _("Show icons when do no disturb is on"),
      model: options,
    });
    group.add(comboRow);

    window._settings = this.getSettings();
    window._settings.bind(
      "right-side",
      row,
      "active",
      Gio.SettingsBindFlags.DEFAULT
    );
    window._settings.bind(
      "colored-icons",
      row2,
      "active",
      Gio.SettingsBindFlags.DEFAULT
    );
    window._settings.bind(
      "dnd-mode",
      comboRow,
      "selected",
      Gio.SettingsBindFlags.DEFAULT
    );
  }
}
