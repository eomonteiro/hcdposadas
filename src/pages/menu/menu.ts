import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, Platform, AlertController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { OneSignal, OSNotificationPayload } from '@ionic-native/onesignal';
import { App } from '../../app/app.global';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  @ViewChild(Nav) nav: Nav;
  pages: Array<{ title: string, component: any, icon: string }>;
  public counter=0;
  rootPage: string = 'HomePage';

  constructor(public navCtrl: NavController, public navParams: NavParams, private socialSharing: SocialSharing, private oneSignal: OneSignal, private platform: Platform, private alertCtrl: AlertController) {

    //this.platform.registerBackButtonAction(() => {
      //if (this.nav.canGoBack()) {
        //this.nav.pop();
      //} else {
        //console.log("backPressed 1");
        //this.presentConfirm();
      //}
    //});
    
    this.platform.registerBackButtonAction(() => {
      if (this.counter == 0) {
        this.nav.pop();
        this.counter++;      
        setTimeout(() => { this.counter = 0 }, 2000)
      } else {
        this.presentConfirm();
      }
    }, 0);

    this.pages = [
      { title: 'Noticias', component: 'HomePage', icon: 'chrome_reader_mode' },
      // { title: 'Categories', component: 'CategoryPage', icon: 'subject' },
      // { title: 'Pages', component: 'PagesPage', icon: 'book' },
      { title: 'Autoridades', component: 'AutoridadesPage', icon: 'person' },
      { title: 'Concejales', component: 'ConcejalesPage', icon: 'group' },
      { title: 'Videos', component: 'YoutubePage', icon: 'play_circle_filled' },
      { title: 'Sesión en VIVO', component: 'VivoPage', icon: 'videocam' },
      { title: 'Agenda', component: 'AgendaPage', icon: 'date_range' },
      { title: 'Digesto', component: 'DigestoPage', icon: 'search' },
      { title: 'Digesto 2', component: 'Digesto2Page', icon: 'search' }
      // { title: 'Bookmarks', component: 'BookmarkPage', icon: 'bookmark' }
      //{ title: 'Rate Us', component: 'HomePage', icon: 'thumb_up' },
      //{ title: 'Share App', component: 'HomePage', icon: 'share' }
    ];

    this.initNotifications();

  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: App.AppName,
      message: '¿Estás seguro de que quieres salir?',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.nav.setRoot('HomePage');
          }
        },
        {
          text: 'Si',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    alert.present();
  }

  openPage(page, title) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (title === 'Rate Us') {
      window.open('market://details?id=' + App.PackageName, '_system');
    } if (title === 'Share App') {
      this.socialSharing.share('', '', '', 'https://play.google.com/store/apps/details?id=' + App.PackageName).then(data => {
        //success
      }).catch(err => {
        //failure
      });
    } else {
      this.nav.setRoot(page.component);
    }
  }

  initNotifications() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.oneSignal.startInit(App.OneSignalAppID, App.GCMServerApiKey);
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);       

        this.oneSignal.handleNotificationOpened().subscribe(() => {
          
          
          let additionalData = jsonData.notification.payload.additionalData;
              if (additionalData.welcome) {


              }
              else {

                var idNovidad: number;
                var tipo: string;

                idNovidad = additionalData.id ? additionalData.id : 0;
                tipo = additionalData.tipo ? additionalData.tipo : '';

                if (tipo == 'post' && idNovidad > 0) {
                setTimeout(() => {
                  this.nav.push('DetailPage', { idNovidad: idNovidad });
                  }, 1000);
                }

              }

          
        });

        this.oneSignal.endInit();
        
      }
    });
  }

  // private onPushOpened(payload: OSNotificationPayload) {
    // if(payload.additionalData.tipo === 'vivo'){
      // this.nav.push('VivoPage');
    // }
  // }

}
