import { AfterViewInit, ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

Chart.register(...registerables, DataLabelsPlugin);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, AfterViewInit {

  usersCount = 0;
  unitsCount = 0;
  bookingsCount = 0;
  adsCount = 0;
  occupancyRate = 0;
  hostCount = 0;
  guestCount = 0;
  maleCount = 0;
  femaleCount = 0;
  approvedAds = 0;
  unapprovedAds = 0;
  paymentStatus = { paid: 0, pending: 0, failed: 0 };

  listingsTitlePieData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  paymentStatusPieData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Paid', 'Pending', 'Failed'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#A2D9CE', '#F9E79F', '#F5B7B1'],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  userTypePieData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Host', 'Guest'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#AED6F1', '#F9E79F'],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  userGenderPieData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Male', 'Female'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#D2B4DE', '#FADBD8'],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  adsApprovalPieData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Approved', 'Unapproved'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#A3E4D7', '#F5CBA7'],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  public miniPieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: '#000',
        formatter: (value: number, context: any) => {
          const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
          const percentage = total > 0 ? (value / total) * 100 : 0;
          return `${percentage.toFixed(0)}%`;
        }
      }
    }
  };

  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;
  public pieChartPlugins = [DataLabelsPlugin];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCounts();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateAllCharts(), 0);
  }

  loadCounts() {
    let usersLoaded = false;
    let unitsLoaded = false;
    let bookingsLoaded = false;
    let listingsLoaded = false;

    this.http.get<any[]>(`${environment.baseUrl}/users`).subscribe(data => {
      this.usersCount = data.length;
      this.hostCount = data.filter(u => u.isAdmin === true).length;
      this.guestCount = data.filter(u => u.isAdmin === false).length;
      this.maleCount = data.filter(u => u.gender === 'male').length;
      this.femaleCount = data.filter(u => u.gender === 'female').length;

      this.userTypePieData.datasets[0].data = [this.hostCount, this.guestCount];
      this.userGenderPieData.datasets[0].data = [this.maleCount, this.femaleCount];

      usersLoaded = true;
      this.tryUpdateCharts(usersLoaded, unitsLoaded, bookingsLoaded, listingsLoaded);
      this.cdr.detectChanges();
    });

    this.http.get<any[]>(`${environment.baseUrl}/units`).subscribe(data => {
      this.unitsCount = data.length;
      unitsLoaded = true;
      this.tryUpdateCharts(usersLoaded, unitsLoaded, bookingsLoaded, listingsLoaded);
      this.cdr.detectChanges();
    });

    this.http.get<any[]>(`${environment.baseUrl}/bookings`).subscribe(data => {
      this.bookingsCount = data.length;
      bookingsLoaded = true;

      this.paymentStatus.paid = data.filter(b => b.paymentStatus === 'Paid').length;
      this.paymentStatus.pending = data.filter(b => b.paymentStatus === 'Pending').length;
      this.paymentStatus.failed = data.filter(b => b.paymentStatus === 'Failed').length;

      this.paymentStatusPieData.datasets[0].data = [
        this.paymentStatus.paid,
        this.paymentStatus.pending,
        this.paymentStatus.failed
      ];

      const dateCounts: { [date: string]: number } = {};
      data.forEach(booking => {
        const date = new Date(booking.date || booking.createdAt).toISOString().split('T')[0];
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      });

      const sortedDates = Object.keys(dateCounts).sort();
      const counts = sortedDates.map(date => dateCounts[date]);

      this.bookingsPerDayLineData.labels = sortedDates;
      this.bookingsPerDayLineData.datasets[0].data = counts;

      this.tryUpdateCharts(usersLoaded, unitsLoaded, bookingsLoaded, listingsLoaded);
      this.cdr.detectChanges();
    });

    this.http.get<any[]>(`${environment.baseUrl}/listings`).subscribe(data => {
      this.adsCount = data.length;
      this.approvedAds = data.filter(ad => ad.isApproved === true).length;
      this.unapprovedAds = data.filter(ad => ad.isApproved === false).length;
      this.adsApprovalPieData.datasets[0].data = [this.approvedAds, this.unapprovedAds];

      const titleCounts: { [title: string]: number } = {};
      data.forEach(ad => {
        const title = ad.title || 'Unknown';
        titleCounts[title] = (titleCounts[title] || 0) + 1;
      });

      this.listingsTitlePieData.labels = Object.keys(titleCounts);
      this.listingsTitlePieData.datasets[0].data = Object.values(titleCounts);
      this.listingsTitlePieData.datasets[0].backgroundColor = Object.keys(titleCounts).map(() => this.getRandomColor());

      listingsLoaded = true;
      this.tryUpdateCharts(usersLoaded, unitsLoaded, bookingsLoaded, listingsLoaded);
      this.cdr.detectChanges();
    });
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  tryUpdateCharts(usersLoaded: boolean, unitsLoaded: boolean, bookingsLoaded: boolean, listingsLoaded: boolean) {
    if (usersLoaded && unitsLoaded && bookingsLoaded && listingsLoaded) {
      this.updateCharts();
      this.updateAllCharts();
    }
  }

  updateCharts() {
    const values = [this.usersCount, this.unitsCount, this.bookingsCount, this.adsCount];
    this.barChartData.datasets[0].data = values;
    this.pieChartData.datasets[0].data = values;

    this.occupancyRate = this.unitsCount > 0
      ? Math.round((this.bookingsCount / this.unitsCount) * 100)
      : 0;

    this.unitTypesLineData.datasets[0].data = [10, 15, 20, 25, 30, 35];
  }

  updateAllCharts() {
    this.charts?.forEach(chart => chart.update());
  }

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Users', 'Units', 'Bookings', 'Listings'],
    datasets: [{
      data: [0, 0, 0, 0],
      label: 'Number',
      backgroundColor: ['#5DADE2', '#58D68D', '#F5B041', '#EC7063'],
      borderRadius: 8
    }]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Overall Statistics' }
    }
  };

  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Users', 'Units', 'Bookings', 'Listings'],
    datasets: [{
      label: 'Percentages',
      data: [0, 0, 0, 0],
      backgroundColor: ['#AED6F1', '#A9DFBF', '#FAD7A0', '#F5B7B1'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Distribution of Percentages' },
      datalabels: {
        color: '#000',
        formatter: (value: number, context: any) => {
          const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
          const percentage = total > 0 ? (value / total) * 100 : 0;
          return `${percentage.toFixed(1)}%`;
        }
      }
    }
  };

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [5, 10, 15, 12, 20, 30],
      label: 'Monthly Users',
      borderColor: '#48C9B0',
      backgroundColor: 'rgba(72, 201, 176, 0.3)',
      fill: true,
      tension: 0.4
    }]
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    }
  };

  public unitTypesLineData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Units Types',
        data: [10, 15, 20, 25, 30, 35],
        borderColor: '#AF7AC5',
        backgroundColor: 'rgba(175, 122, 197, 0.3)',
        fill: true,
        tension: 0.6,
        pointRadius: 5,
        pointBackgroundColor: '#AF7AC5'
      }
    ]
  };

  public bookingsPerDayLineData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Daily Bookings',
        data: [],
        borderColor: '#F4D03F',
        backgroundColor: 'rgba(244, 208, 63, 0.3)',
        fill: true,
        tension: 0.6,
        pointRadius: 5,
        pointBackgroundColor: '#F4D03F'
      }
    ]
  };
}
