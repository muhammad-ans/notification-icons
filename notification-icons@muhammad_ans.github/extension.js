/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import St from 'gi://St';


let topbarNotification;
let dateMenu = Main.panel.statusArea.dateMenu;


export default class topbarNotificationIcons {
    enable() {
        topbarNotification = new TopbarNotification();
        dateMenu.get_first_child().insert_child_below(topbarNotification, dateMenu._clockDisplay);
    }

    disable() {
        topbarNotification._destroy();
        topbarNotification = null;
    }
}

const TopbarNotification = GObject.registerClass(
    class TopbarNotification extends St.BoxLayout {
        _init() {
            super._init({
                y_align: Clutter.ActorAlign.CENTER,
                x_align: Clutter.ActorAlign.CENTER,            
                visible: true
            });

            this.signals = [
                Main.messageTray.connect('source-added', this._onSourceAdded.bind(this)),
                Main.messageTray.connect('source-removed', this._updateAllSources.bind(this)),
            ];
            this._updateAllSources(this);
        }
        _onSourceAdded(tray, source) {
            if (source._policy.id != 'generic') {
                if (this.get_children().findIndex(child => child.icon_name == source._policy.id) == -1) {
                    let _icon = new St.Icon({
                        icon_name: source._policy.id,
                        icon_size: 18,
                        style_class: 'app-menu-icon topbar-notification-icon',
                    });
                    _icon.add_effect(new Clutter.DesaturateEffect());
                    this.add_child(_icon);
                    
                }
            }
        }
        _updateAllSources() {
            this.remove_all_children();
            Main.messageTray.getSources().forEach(source => this._onSourceAdded(null, source));
        }

        _destroy() {
            this.signals.forEach(signal => {
                Main.messageTray.disconnect(signal);
            });
            this.destroy();
        }
    }
);
