﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using backend.Data;

#nullable disable

namespace backend.Migrations.DatasetTag
{
    [DbContext(typeof(DatasetTagContext))]
    [Migration("20220525185525_Tags3")]
    partial class Tags3
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("backend.Models.Dataset", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FileName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Path")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("Public")
                        .HasColumnType("boolean");

                    b.Property<int>("UserID")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("Datasets");
                });

            modelBuilder.Entity("backend.Models.DatasetDatasetTag", b =>
                {
                    b.Property<int>("DatasetId")
                        .HasColumnType("integer");

                    b.Property<int>("DatasetTagId")
                        .HasColumnType("integer");

                    b.HasKey("DatasetId", "DatasetTagId");

                    b.HasIndex("DatasetTagId");

                    b.ToTable("DatasetDatasetTags");
                });

            modelBuilder.Entity("backend.Models.DatasetTag", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Tag")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Tags");
                });

            modelBuilder.Entity("DatasetDatasetTag", b =>
                {
                    b.Property<int>("DatasetsId")
                        .HasColumnType("integer");

                    b.Property<int>("TagsId")
                        .HasColumnType("integer");

                    b.HasKey("DatasetsId", "TagsId");

                    b.HasIndex("TagsId");

                    b.ToTable("DatasetDatasetTag", (string)null);
                });

            modelBuilder.Entity("backend.Models.DatasetDatasetTag", b =>
                {
                    b.HasOne("backend.Models.Dataset", "Dataset")
                        .WithMany()
                        .HasForeignKey("DatasetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Models.DatasetTag", "DatasetTag")
                        .WithMany()
                        .HasForeignKey("DatasetTagId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Dataset");

                    b.Navigation("DatasetTag");
                });

            modelBuilder.Entity("DatasetDatasetTag", b =>
                {
                    b.HasOne("backend.Models.Dataset", null)
                        .WithMany()
                        .HasForeignKey("DatasetsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Models.DatasetTag", null)
                        .WithMany()
                        .HasForeignKey("TagsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
